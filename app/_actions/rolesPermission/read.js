'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get All Roles and Permissions
 */
export async function getAllRolesPermission() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/admin/roles-permissions`, {
            method: 'GET',
            next: { 
                revalidate: 3600, // 1 hour cache
                tags: ['roles-permissions'] 
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch roles and permissions' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
