import { Redis } from '@upstash/redis';
import { jwtDecode } from 'jwt-decode';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import authConfig from './auth.config';

// Initialize Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
});

// Add a mutex to prevent concurrent refresh attempts
const refreshMutex = new Map();

/**
 * Fetches token from Redis storage
 */
async function getTokenFromRedis(userId, provider) {
    try {
        const key = `user:${userId}:${provider}:tokens`;
        const tokens = await redis.get(key);
        return tokens || null;
    } catch (error) {
        console.error('❌ [REDIS GET ERROR]:', error);
        return null;
    }
}

/**
 * Stores token in Redis storage with proper expiry
 */
async function storeTokenInRedis(userId, provider, tokens) {
    try {
        const key = `user:${userId}:${provider}:tokens`;
        // Calculate expiry based on token expiration, not fixed 7 days
        const now = Date.now();
        const expiresIn = Math.max(
            Math.floor((tokens.accessTokenExpires - now) / 1000),
            60
        ); // At least 60 seconds

        await redis.set(key, tokens, { ex: expiresIn });
        console.log(
            `💾 [REDIS STORE] Tokens stored for user ${userId}, expires in ${expiresIn}s`
        );
    } catch (error) {
        console.error('❌ [REDIS STORE ERROR]:', error);
    }
}

/**
 * Removes token from Redis storage
 */
async function removeTokenFromRedis(userId, provider) {
    try {
        const key = `user:${userId}:${provider}:tokens`;
        await redis.del(key);
        console.log(`🗑️ [REDIS DELETE] Tokens removed for user ${userId}`);
    } catch (error) {
        console.error('❌ [REDIS DELETE ERROR]:', error);
    }
}

/**
 * Refreshes the access token when it's expired
 */
async function refreshAccessToken(token) {
    const mutexKey = `${token.id}-${token.provider}`;

    // Check if refresh is already in progress
    if (refreshMutex.has(mutexKey)) {
        console.log('🔁 [REFRESH TOKEN] Waiting for ongoing refresh...');
        return await refreshMutex.get(mutexKey);
    }

    // Create refresh promise and store in mutex
    const refreshPromise = performTokenRefresh(token);
    refreshMutex.set(mutexKey, refreshPromise);

    try {
        const result = await refreshPromise;
        return result;
    } finally {
        // Clean up mutex
        refreshMutex.delete(mutexKey);
    }
}

async function performTokenRefresh(token) {
    console.log('🔁 [REFRESH TOKEN] Starting token refresh...');

    // Check if we have fresher tokens in Redis first
    if (token.id && token.provider) {
        const storedTokens = await getTokenFromRedis(token.id, token.provider);
        if (
            storedTokens &&
            storedTokens.accessTokenExpires > Date.now() + 30000
        ) {
            console.log('🔄 [REFRESH TOKEN] Using fresh token from Redis');
            return {
                ...token,
                ...storedTokens,
            };
        }
    }

    const refreshTokenToUse = token.refreshToken;
    console.log(
        '🔁 [REFRESH TOKEN TO USE]:',
        refreshTokenToUse ? 'Present' : 'Missing'
    );

    if (!refreshTokenToUse) {
        console.error('❌ [REFRESH TOKEN] No refresh token available');
        return {
            ...token,
            error: 'RefreshTokenNotAvailable',
        };
    }

    try {
        // Determine user type from token payload or role
        const isCustomer = determineUserType(token);

        console.log(
            `🔄 [REFRESH TOKEN] Refreshing ${isCustomer ? 'customer' : 'user'
            } token...`
        );

        const endpoint = isCustomer
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/b2c-customer/refresh-token`
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${refreshTokenToUse}`,
            },
        });
        console.log(`Refreshed API Response`, response);

        if (!response.ok) {
            // Try the other endpoint as fallback
            console.log(
                `🔄 [REFRESH TOKEN] Primary endpoint failed, trying fallback...`
            );
            const fallbackResult = await tryFallbackRefresh(token, !isCustomer);
            if (fallbackResult) return fallbackResult;

            const errorData = await response.json();
            console.error('❌ [REFRESH TOKEN FAILED]:', errorData);
            throw new Error(
                `Refresh failed: ${errorData.message || 'Unknown error'}`
            );
        }

        const refreshedTokens = await response.json();
        console.log('✅ [REFRESH TOKEN SUCCESS]');

        if (!refreshedTokens.accessToken) {
            throw new Error('No access token received from refresh endpoint');
        }

        const decodedToken = jwtDecode(refreshedTokens.accessToken);
        const expiresAt = decodedToken.exp * 1000;

        const updatedToken = {
            ...token,
            accessToken: refreshedTokens.accessToken,
            refreshToken: refreshedTokens.refreshToken || refreshTokenToUse,
            accessTokenExpires: expiresAt,
            error: undefined, // Clear any previous errors
        };

        // Store the new tokens in Redis
        if (token.id) {
            await storeTokenInRedis(token.id, token.provider || 'credentials', {
                accessToken: refreshedTokens.accessToken,
                refreshToken: refreshedTokens.refreshToken || refreshTokenToUse,
                accessTokenExpires: expiresAt,
            });
        }

        return updatedToken;
    } catch (error) {
        console.error('❌ [REFRESH TOKEN ERROR]:', error);

        // Handle specific error cases
        if (
            error.message?.includes('Invalid refresh token') ||
            error.message?.includes('refreshToken')
        ) {
            console.log(
                '🗑️ [REFRESH TOKEN] Refresh token is invalid, clearing...'
            );

            // Clean up Redis
            if (token.id && token.provider) {
                await removeTokenFromRedis(token.id, token.provider);
            }

            return {
                ...token,
                error: 'RefreshTokenExpired',
                accessToken: null,
                refreshToken: null,
            };
        }

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

async function tryFallbackRefresh(token, isCustomerFallback) {
    try {
        const endpoint = isCustomerFallback
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/b2c-customer/refresh-token`
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token.refreshToken}`,
            },
        });

        if (response.ok) {
            const refreshedTokens = await response.json();
            const decodedToken = jwtDecode(refreshedTokens.accessToken);
            const expiresAt = decodedToken.exp * 1000;

            const updatedToken = {
                ...token,
                accessToken: refreshedTokens.accessToken,
                refreshToken:
                    refreshedTokens.refreshToken || token.refreshToken,
                accessTokenExpires: expiresAt,
                error: undefined,
            };

            // Store in Redis
            if (token.id) {
                await storeTokenInRedis(
                    token.id,
                    token.provider || 'credentials',
                    {
                        accessToken: refreshedTokens.accessToken,
                        refreshToken:
                            refreshedTokens.refreshToken || token.refreshToken,
                        accessTokenExpires: expiresAt,
                    }
                );
            }

            return updatedToken;
        }
    } catch (error) {
        console.error('❌ [FALLBACK REFRESH ERROR]:', error);
    }

    return null;
}

function determineUserType(token) {
    // Method 1: Check provider first
    if (token.provider === 'credentials-customer') {
        return true; // customer
    }
    if (token.provider === 'credentials-user') {
        return false; // user
    }

    // Method 2: Check userType if available
    if (token.userType) {
        return token.userType === 'customer';
    }

    // Method 3: Check role
    if (token.role) {
        return (
            token.role.toLowerCase().includes('customer') ||
            token.role.toLowerCase().includes('b2c')
        );
    }

    // Method 4: Legacy credentials check
    if (token.provider === 'credentials') {
        return true; // Default to customer for legacy
    }

    // Default to user for OAuth providers
    return false;
}

export const { handlers, signIn, auth, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    ...authConfig,
    providers: [
        CredentialsProvider({
            id: 'credentials-customer',
            name: 'Customer Credentials',
            credentials: {
                email: {},
                password: {},
                tenantId: {}, // Add tenant support for customers
            },
            async authorize(credentials) {
                console.log(
                    '🔐 [AUTHORIZE CUSTOMER] Login attempt with email:',
                    credentials?.email
                );

                if (!credentials?.email || !credentials?.password) {
                    console.log(
                        '❌ [AUTHORIZE CUSTOMER] Missing email or password'
                    );
                    return null;
                }

                try {
                    const body = {
                        email: credentials.email,
                        password: credentials.password,
                    };

                    // Add tenantId if provided
                    if (credentials.tenantId) {
                        body.tenantId = credentials.tenantId;
                    }

                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/b2c-customer/signin`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                        }
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(
                            '❌ [AUTHORIZE CUSTOMER] API Error:',
                            errorData
                        );
                        return null;
                    }

                    const data = await response.json();

                    return {
                        id: data.id,
                        email: data.email,
                        name: data.name,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        provider: 'credentials-customer',
                        role: data.role,
                        userType: 'customer',
                        tenantId: credentials.tenantId,
                    };
                } catch (error) {
                    console.error('❌ [AUTHORIZE CUSTOMER] API Error:', error);
                    return null;
                }
            },
        }),
        CredentialsProvider({
            id: 'credentials-user',
            name: 'User Credentials',
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                console.log(
                    '🔐 [AUTHORIZE USER] Login attempt with email:',
                    credentials?.email
                );

                if (!credentials?.email || !credentials?.password) {
                    console.log(
                        '❌ [AUTHORIZE USER] Missing email or password'
                    );
                    return null;
                }

                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signin`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        }
                    );
                    console.log(
                        '🔑 [AUTHORIZE USER] Login  Response:',
                        response
                    );

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error(
                            '❌ [AUTHORIZE USER] API Error:',
                            errorData
                        );
                        return null;
                    }

                    const data = await response.json();
                    console.log(
                        '🔑 [AUTHORIZE USER] Login Response Data:',
                        data
                    );

                    return {
                        id: data.id,
                        email: data.email,
                        name: data.name,
                        role: data.role,
                        accessToken: data.accessToken,
                        refreshToken: data.refreshToken,
                        tenantId: data.tenantId,
                        provider: 'credentials-user',
                        userType: 'user',
                    };
                } catch (error) {
                    console.error('❌ [AUTHORIZE USER] API Error:', error);
                    return null;
                }
            },
        }),

    ],

    callbacks: {
        async signIn({ user, account, profile }) {
            console.log(
                '👋 [SIGN IN] User signing in via:',
                account?.provider || 'unknown'
            );

            // For credentials providers, user object already has the necessary data
            if (account?.provider?.startsWith('credentials')) {
                console.log('✅ [SIGN IN] Credentials login successful');
                return true;
            }
        },

        async jwt({ token, user, account }) {
            console.log('🔑 [JWT CALLBACK] Started');

            // Initial sign-in
            if (user) {
                console.log('👤 [JWT CALLBACK] New sign-in');

                let accessTokenExpires;

                // Calculate token expiry
                if (user.accessToken) {
                    try {
                        const decoded = jwtDecode(user.accessToken);
                        accessTokenExpires = decoded.exp * 1000;
                    } catch (error) {
                        console.error('❌ [JWT DECODE ERROR]:', error);
                        accessTokenExpires = Date.now() + 3600 * 1000; // Default to 1 hour
                    }
                } else if (account?.expires_at) {
                    accessTokenExpires = account.expires_at * 1000;
                } else {
                    accessTokenExpires = Date.now() + 3600 * 1000; // Default to 1 hour
                }

                console.log(
                    '✅ [JWT CALLBACK] Token expires at:',
                    new Date(accessTokenExpires)
                );

                const newToken = {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: accessTokenExpires,
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user?.role,
                    provider: user.provider,
                    userType: user.userType,
                };

                // Store tokens in Redis during sign-in
                if (user.id && user.provider) {
                    await storeTokenInRedis(user.id, user.provider, {
                        accessToken: user.accessToken,
                        refreshToken: user.refreshToken,
                        accessTokenExpires: accessTokenExpires,
                    });
                }

                return newToken;
            }

            // For subsequent requests, check if token needs refresh
            const now = Date.now();
            const refreshThreshold = 30000; // 30 seconds before expiry

            // Check if token is expired or close to expiry
            if (
                token.accessTokenExpires &&
                now >= token.accessTokenExpires - refreshThreshold
            ) {
                console.log(
                    '⚠️ [JWT CALLBACK] Token expired or close to expiry, refreshing...'
                );
                return await refreshAccessToken(token);
            }

            // Check Redis for fresher tokens (in case of concurrent sessions)
            if (token.id && token.provider) {
                const storedTokens = await getTokenFromRedis(
                    token.id,
                    token.provider
                );
                if (
                    storedTokens &&
                    storedTokens.accessTokenExpires > token.accessTokenExpires
                ) {
                    console.log('🔄 [JWT] Using fresher token from Redis');
                    return {
                        ...token,
                        ...storedTokens,
                    };
                }
            }

            return token;
        },

        async session({ session, token }) {
            console.log('📦 [SESSION CALLBACK] Building session');

            // Transfer token data to session
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.accessTokenExpires = token.accessTokenExpires;
            session.provider = token.provider;
            session.userType = token.userType;
            session.user = {
                id: token.id,
                name: token.name,
                role: token?.role,
                email: token.email,
                provider: token.provider,
                userType: token.userType,
            };

            if (token?.error) {
                console.error(
                    '⚠️ [SESSION CALLBACK] Error in token:',
                    token.error
                );
                session.error = token.error;
            }

            return session;
        },
    },

    events: {
        async signIn(message) {
            console.log('🚪 [EVENT] User signed in:', message.user.email);
        },
        async signOut({ token }) {
            console.log('👋 [EVENT] User signed out');
            // Clear tokens from Redis on sign out
            if (token?.id && token?.provider) {
                await removeTokenFromRedis(token.id, token.provider);
            }
        },
    },

    jwt: {
        maxAge: 60 * 60 * 24 * 7, // 7 days
    },
    pages: {
        signIn: '/',
        error: '/auth/error',
    },
    debug: process.env.NODE_ENV === 'development',
});

