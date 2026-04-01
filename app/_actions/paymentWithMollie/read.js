'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Mollie Payment Status
 */
export async function getMolliePaymentStatus(paymentId) {
    if (!paymentId) return { success: false, error: { message: 'Payment ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/mollie/status/${paymentId}`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch payment status' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Mollie Payment Methods
 */
export async function getMolliePaymentMethods() {
    try {
        const responsePromise = fetch(`${baseUrl}/mollie/methods`, {
            method: 'GET',
            next: { revalidate: 3600 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch payment methods' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
