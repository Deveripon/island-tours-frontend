'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Create Mollie Payment
 */
export async function createMolliePayment(data) {
    if (!data) return { success: false, error: { message: 'Payment data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/mollie/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Payment initiation failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
