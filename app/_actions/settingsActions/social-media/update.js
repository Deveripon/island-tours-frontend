'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { revalidatePath, updateTag } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Update Social Media links
 */
export async function updateSocialMedia(data) {
    if (!data) return { success: false, error: { message: 'Data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/social-media`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag(`social-media`);
        revalidatePath('/'); // Global footer usually shows these

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
