'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Trip Payment Preferences
 */
export async function getTripPaymentPreferences() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/trip-payment-preferences`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { 
                revalidate: 3600, 
                tags: ['trip-payments'] 
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch preferences' } };

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
