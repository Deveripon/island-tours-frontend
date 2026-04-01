'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all users
 */
export async function getAllUsers() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['users'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch users' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
    if (!id) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['users', `user-${id}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch user' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get user by Email
 */
export async function getUserByEmail(email) {
    if (!email) return { success: false, error: { message: 'Email is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/email/${email}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['users', `user-email-${email}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'User not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
