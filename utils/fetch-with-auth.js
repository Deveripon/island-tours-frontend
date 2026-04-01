'use server';
import { auth, signOut } from '@/auth';

// Add a simple in-memory lock to prevent concurrent refresh attempts
const refreshLocks = new Map();

export async function fetchWithAuth(input, init, providedSession = null) {
    let session = providedSession || (await auth());

    if (!session?.accessToken) {
        throw new Error('No access token available');
    }

    // Check if token is close to expiry (within 30 seconds)
    const now = Date.now();
    const tokenExpiry = session.accessTokenExpires || 0;
    const isTokenExpiring = now >= tokenExpiry - 30000;

    if (isTokenExpiring) {
        // Get fresh session (NextAuth will handle the refresh)
        session = await auth();

        if (!session?.accessToken) {
            throw new Error('Session refresh failed');
        }
    }

    // Make the API request
    let res = await fetch(input, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            Authorization: `Bearer ${session.accessToken}`,
        },
        credentials: 'include',
    });

    // Handle 401 Unauthorized
    if (res.status === 401) {
        // Prevent concurrent refresh attempts
        const lockKey = session.user?.id || 'anonymous';
        if (refreshLocks.has(lockKey)) {
            await refreshLocks.get(lockKey);
        } else {
            // Create refresh promise
            const refreshPromise = refreshSessionAndRetry();
            refreshLocks.set(lockKey, refreshPromise);

            try {
                const result = await refreshPromise;
                return result;
            } finally {
                refreshLocks.delete(lockKey);
            }
        }

        // Get fresh session after refresh
        session = await auth();

        if (!session?.accessToken) {
            throw new Error('Authentication failed - please sign in again');
        }

        // Retry the original request with fresh token
        res = await fetch(input, {
            ...init,
            headers: {
                ...(init?.headers || {}),
                Authorization: `Bearer ${session.accessToken}`,
            },
            credentials: 'include',
        });

        // If still 401 after refresh, sign out user
        if (res.status === 401) {
            await signOut({ redirect: false });
            throw new Error('Authentication failed - redirecting to sign in');
        }
    }

    return res;

    async function refreshSessionAndRetry() {
        try {
            // Force NextAuth to refresh the session
            // This will trigger the JWT callback which handles token refresh
            const freshSession = await auth();

            if (!freshSession?.accessToken || freshSession.error) {
                // If refresh failed, try manual refresh via API
                if (session?.refreshToken) {
                    const refreshResult = await manualTokenRefresh(session);

                    if (refreshResult) {
                        // Retry with manually refreshed token
                        return await fetch(input, {
                            ...init,
                            headers: {
                                ...(init?.headers || {}),
                                Authorization: `Bearer ${refreshResult.accessToken}`,
                            },
                            credentials: 'include',
                        });
                    }
                }

                throw new Error('Session refresh failed');
            }

            // Retry the original request with fresh session
            return await fetch(input, {
                ...init,
                headers: {
                    ...(init?.headers || {}),
                    Authorization: `Bearer ${freshSession.accessToken}`,
                },
                credentials: 'include',
            });
        } catch (error) {
            throw error;
        }
    }
}

async function manualTokenRefresh(session) {
    try {
        const isCustomer =
            session.userType === 'customer' ||
            session.provider === 'credentials';

        const endpoint = isCustomer
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/b2c-customer/refresh-token`
            : `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.refreshToken}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('❌ [MANUAL REFRESH] Failed:', await response.text());
            return null;
        }

        const tokens = await response.json();

        if (!tokens.accessToken) {
            return null;
        }

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken || session.refreshToken,
        };
    } catch (error) {
        return null;
    }
}

// Enhanced version with retry logic and better error handling
export async function fetchWithAuthRetry(
    input,
    init,
    providedSession = null,
    maxRetries = 2
) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                // Wait a bit before retrying
                await new Promise(resolve =>
                    setTimeout(resolve, 1000 * attempt)
                );
            }

            const result = await fetchWithAuth(input, init, providedSession);

            // If we get here, the request succeeded
            if (attempt > 0) {
            }

            return result;
        } catch (error) {
            lastError = error;

            // Don't retry for certain errors
            if (
                error.message?.includes('Authentication failed') ||
                error.message?.includes('No access token') ||
                attempt === maxRetries
            ) {
                break;
            }
        }
    }

    throw lastError;
}

