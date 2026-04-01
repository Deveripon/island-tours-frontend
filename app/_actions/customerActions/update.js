'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag } from 'next/cache';
import { auth, signIn } from '@/auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Update Customer
 */
export async function updateB2cCustomer(id, data) {
    if (!id || !data) return { success: false, error: { message: 'Customer ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/b2c-customer/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            next: { tags: ['customers', `customer-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('customers');
        updateTag(`customer-${id}`);

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Customer Sign Up
 */
export async function handleCustomerSignup(data) {
    if (!data) return { success: false, error: { message: 'Signup data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/b2c-customer/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Signup failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Customer Sign In
 */
export async function handleCustomerSignIn({ email, password, tenantId }) {
    if (!email || !password) return { success: false, error: { message: 'Email and password are required' } };

    try {
        const result = await signIn('credentials-customer', {
            email,
            password,
            tenantId, // Preserved for now
            redirect: false
        });

        if (!result) return { success: false, error: { message: 'Invalid email or password' } };

        await new Promise(resolve => setTimeout(resolve, 1500));
        const session = await auth();

        return {
            success: true,
            user: session?.user,
            id: session?.user?.id,
        };
    } catch (error) {
        return { success: false, error: { message: 'Sign in failed' } };
    }
}

/**
 * Send OTP to Customer
 */
export async function sendOtpToCustomerEmail(email) {
    if (!email) return { success: false, error: { message: 'Email is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/b2c-customer/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
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
 * Resend OTP to Customer
 */
export async function resendOtpToCustomerEmail(email) {
    if (!email) return { success: false, error: { message: 'Email is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/b2c-customer/resend-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
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
 * Verify Customer OTP
 */
export async function verifyCustomerOtp(email, otp) {
    if (!email || !otp) return { success: false, error: { message: 'Email and OTP are required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/b2c-customer/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
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
 * Forgot Password
 */
export async function updateForgottenPasswordOfCustomer(email, password) {
    if (!email || !password) return { success: false, error: { message: 'Email and password are required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/b2c-customer/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to update password' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Reset Password
 */
export async function resetCustomerPassword(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/b2c-customer/${id}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Password reset failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
