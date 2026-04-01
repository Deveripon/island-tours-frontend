'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { revalidatePath, updateTag } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Update Billing Information
 */
export async function updateBillingInformation(data) {
    if (!data) return { success: false, error: { message: 'Data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/billing-information`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('billing');
        revalidatePath('/');

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
