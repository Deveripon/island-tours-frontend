'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Create a new activity
 */
export async function createActivity(data) {
    if (!data) return { success: false, error: { message: 'Activity data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Creation failed' } };

        updateTag('activities');
        revalidatePath('/dashboard/activities');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update activity by ID
 */
export async function updateActivity(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/activities/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('activities');
        updateTag(`activity-${id}`);
        revalidatePath('/dashboard/activities');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete activity by ID
 */
export async function deleteActivity(id) {
    if (!id) return { success: false, error: { message: 'ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/activities/${id}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('activities');
        updateTag(`activity-${id}`);
        revalidatePath('/dashboard/activities');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
