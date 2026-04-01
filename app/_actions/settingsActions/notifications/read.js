'use server';


import { fetchWithAuth } from '@/utils/fetch-with-auth';


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Notification Preferences
 */
export async function getNotificationPreferences() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/notification-preferences`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: {
                revalidate: 3600,
                tags: ['notification-preferences']
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch notification preferences' } };

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
