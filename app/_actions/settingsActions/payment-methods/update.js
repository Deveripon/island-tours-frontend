'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { revalidatePath, updateTag } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Update Stripe Configuration
 */
export async function updateStripeConfiguration(data) {
    if (!data) return { success: false, error: { message: 'Data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/update-payment-methods/stripe`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('stripe');
        updateTag('payment-methods');
        revalidatePath('/');

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update Mollie Configuration
 */
export async function updateMollieConfiguration(data) {
    if (!data) return { success: false, error: { message: 'Data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/update-payment-methods/mollie`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('mollie');
        updateTag('payment-methods');
        revalidatePath('/');

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
