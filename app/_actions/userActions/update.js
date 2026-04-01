'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Update user by ID
 */
export async function updateUserById(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('users');
        updateTag(`user-${id}`);
        revalidatePath('/dashboard/users');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Handle user password reset (Authenticated)
 */
export async function resetUserPassword(data) {
    if (!data) return { success: false, error: { message: 'Password data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/reset-password`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Password reset failed' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Create user by admin
 */
export async function createUserByAdmin(data) {
    if (!data) return { success: false, error: { message: 'User data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/create-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Creation failed' } };

        updateTag('users');
        revalidatePath('/dashboard/users');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update forgotten password by email
 */
export async function updateUserForgottedPassword(email, data) {
    if (!email || !data) return { success: false, error: { message: 'Email and data are required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/user/forgot-update-password/${email}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update user role (Admin)
 */
export async function updateUserRole(userId, data) {
    if (!userId || !data) return { success: false, error: { message: 'User ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/update-user-role/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Role update failed' } };

        updateTag('users');
        updateTag(`user-${userId}`);
        revalidatePath('/dashboard/users');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update any user by admin
 */
export async function updateUserByAdmin(userId, data) {
    if (!userId || !data) return { success: false, error: { message: 'User ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/update-user/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('users');
        updateTag(`user-${userId}`);
        revalidatePath('/dashboard/users');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete user (Admin)
 */
export async function deleteUserByAdmin(userId) {
    if (!userId) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/user/delete-user/${userId}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('users');
        updateTag(`user-${userId}`);
        revalidatePath('/dashboard/users');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
