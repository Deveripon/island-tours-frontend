'use server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Create Stripe Checkout Session
 */
export async function createStripeCheckoutSession(data) {
    if (!data) return { success: false, error: { message: 'Checkout data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/stripe/affiliate/create-checkout-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Checkout session creation failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Pay pending amount of an existing booking
 */
export async function payPendingPayment(data) {
    if (!data) return { success: false, error: { message: 'Payment data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/stripe/affiliate/create-checkout-session`, {
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

