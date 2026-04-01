'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Creates a new pickup.
 */
export async function createNewPickup(data) {
    if (!data || typeof data !== 'object') {
        return { success: false, error: { message: 'Invalid pickup data provided' } };
    }

    try {
        const responsePromise = fetchWithAuth(`${baseurl}/pickups`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['pickups'] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: { message: result?.message || 'Failed to create pickup' },
            };
        }

        updateTag('pickups');
        revalidatePath('/dashboard/pickups');

        return {
            success: true,
            result,
        };
    } catch (error) {
        return {
            success: false,
            error: { message: error?.message || 'An unexpected error occurred' },
        };
    }
}
