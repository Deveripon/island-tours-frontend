'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Creates a new payment.
 */
export async function createNewPayment(data) {
    if (!data) return { success: false, error: { message: 'Invalid payment data provided' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['payments'] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to create payment' } };

        updateTag('payments');
        revalidatePath('/dashboard/payments');

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Complete Payment
 */
export async function completePayment(paymentId, data) {
    if (!paymentId || !data) return { success: false, error: { message: 'Payment ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments/${paymentId}/complete`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['payments', `payment-${paymentId}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to complete payment' } };

        updateTag('payments');
        updateTag(`payment-${paymentId}`);

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update Payment by ID
 */
export async function updatePaymentById(id, data) {
    if (!id || !data) return { success: false, error: { message: 'Payment ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['payments', `payment-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to update payment' } };

        updateTag('payments');
        updateTag(`payment-${id}`);
        revalidatePath('/dashboard/payments');

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update Payment Status by ID
 */
export async function updatePaymentStatusById(id, status) {
    if (!id || !status) return { success: false, error: { message: 'Payment ID and status are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['payments', `payment-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to update payment status' } };

        updateTag('payments');
        updateTag(`payment-${id}`);
        revalidatePath('/dashboard/payments');

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete Payment by ID
 */
export async function deletePaymentById(id) {
    if (!id) return { success: false, error: { message: 'Payment ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments/${id}`, {
            method: 'DELETE',
            next: { tags: ['payments', `payment-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to delete payment' } };

        updateTag('payments');
        updateTag(`payment-${id}`);
        revalidatePath('/dashboard/payments');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
