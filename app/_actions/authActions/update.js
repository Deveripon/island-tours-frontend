'use server';

import { auth, signIn } from '@/auth';
import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Sign In with Credentials
 */
export async function signInWithCredentials({ email, password }) {
    // Input validation (Rule 7.8)
    if (!email || !password) {
        return {
            success: false,
            error: {
                message: 'Email and password are required',
            },
        };
    }

    try {
        const result = await signIn('credentials-user', {
            email,
            password,
            redirect: false
        });

        // Early return on failure (Rule 7.8)
        if (!result) {
            return {
                success: false,
                error: {
                    message: 'Invalid email or password',
                },
            };
        }

        // Get the session to return user data
        try {
            // Wait for NextAuth session to be established
            // Note: This 1.5s delay is inherited from existing code but ideally should be minimized if possible
            await new Promise(resolve => setTimeout(resolve, 1500));
            const session = await auth();

            return {
                success: true,
                user: session?.user,
                id: session?.user?.id,
            };
        } catch (sessionError) {
            console.error('Session retrieval error after sign in:', sessionError);
            // Even if session retrieval fails, sign in was successful
            return {
                success: true,
                user: null,
                id: null,
            };
        }
    } catch (error) {
        console.error('Error in handleSignInWithCredentials:', error);
        return {
            success: false,
            error: {
                message: error?.message === 'CredentialsSignin' ? 'Invalid email or password' : 'Invalid email or password',
            },
        };
    }
}
/**
 * Send OTP
 */
export async function sendOtp(data) {
    if (!data) return { success: false, error: { message: 'Data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to send OTP' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Resend OTP
 */
export async function resendOtp(data) {
    if (!data) return { success: false, error: { message: 'Data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/auth/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to resend OTP' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Verify OTP
 */
export async function verifyOtp(data) {
    if (!data) return { success: false, error: { message: 'Data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Verification failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get User Profile
 */
export async function getUserProfile(userId) {
    if (!userId) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/auth/profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch profile' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Logout
 */
export async function logout() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/auth/logout`, {
            method: 'POST'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Logout failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Logout All Devices
 */
export async function logoutAll() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/auth/logout-all`, {
            method: 'POST'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Logout from all devices failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
