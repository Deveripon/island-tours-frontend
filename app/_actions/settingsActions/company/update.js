'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { revalidatePath, updateTag } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Update Company Info
 */
export async function updateCompanyInfo(data) {
    if (!data) return { success: false, error: { message: 'Nothing to update' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/settings/company-information`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network Error' } };

        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag(`company`);
        revalidatePath('/'); // Company info might be everywhere (footer, contact, etc.)

        return result;
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
