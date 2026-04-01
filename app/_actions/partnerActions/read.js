'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all partners
 */
export async function getAllPartners() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/partners`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['partners'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch partners' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get partner by ID
 */
export async function getPartnerById(id) {
    if (!id) return { success: false, error: { message: 'Partner ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/partners/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['partners', `partner-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Partner not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
