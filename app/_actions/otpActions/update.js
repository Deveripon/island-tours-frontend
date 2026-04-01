'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

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
