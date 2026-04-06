'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { revalidatePath, updateTag } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Update  Site Theme
 */
export async function updateSiteTheme(data) {
    if (!data) return { success: false, error: { message: 'Nothing to update' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/site-theme`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },

        });

        const response = await responsePromise;

        if (!response) {
            return { success: false, error: { message: 'Network request failed' } };
        }

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag(`site-theme`);
        revalidatePath('/'); // Theme changes affect the entire site

        return {
            success: true,
            result,
        };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
