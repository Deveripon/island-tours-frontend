'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Stripe Session
 */
export async function getStripeSession(sessionId) {
    if (!sessionId) return { success: false, error: { message: 'Session ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/stripe/session/${sessionId}`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch stripe session' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
