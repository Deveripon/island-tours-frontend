'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag } from 'next/cache';

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Delete Pickup by ID
 */
export async function deletePickupsById(id) {
    if (!id) return { success: false, error: { message: 'ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseurl}/pickups/${id}`, {
            method: 'DELETE',
            next: { tags: ['pickups', `pickup-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: { message: result?.message || 'Failed to delete pickup' },
            };
        }

        updateTag('pickups');
        updateTag(`pickup-${id}`);

        return {
            success: true,
            result,
        };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
