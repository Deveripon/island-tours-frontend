'use server';

import { fetchWithAuth } from "@/utils/fetch-with-auth";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get Mailchimp Config
 */
export async function getMailchimpConfig() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/mailchimp`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: {
                revalidate: 0,
                tags: ['mailchimp']
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch mailchimp configuration' } };

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}