'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all media items
 */
export async function getAllMedia(query = '') {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['media'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch media' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get uploaded media for a user
 */
export async function getUserMedia(userId, query = '') {
    if (!userId) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery/user/${userId}${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['media', `user-media-${userId}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch user media' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Search media items
 */
export async function searchMedia(query = '', params = {}) {
    try {
        const queryStr = new URLSearchParams({ q: query, ...params }).toString();
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery/search?${queryStr}`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Search failed' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get media statistics for a user
 */
export async function getUserMediaStats(userId) {
    if (!userId) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/media-gallery/stats/user/${userId}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['media-stats', `user-stats-${userId}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch stats' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get single media item
 */
export async function getSingleMedia(id) {
    if (!id) return { success: false, error: { message: 'Media ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['media', `media-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch media' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Images List from Cloudinary
 */
export async function getImagesList(folder = 'drafts', limit = 50) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/upload/images/list?folder=${folder}&limit=${limit}`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch images' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
