'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all affiliate trips with filtering
 */
export async function getAllTrips(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/affiliate-trips${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['affiliate-trips'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch trips' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get all affiliate trips by destination
 */
export async function getTripsByDestination(destinationId, query = '') {
    if (!destinationId) return { success: false, error: { message: 'Destination ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/affiliate-trips/destination/${destinationId}${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['affiliate-trips', `destination-trips-${destinationId}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get all affiliate trips by activity
 */
export async function getTripsByActivity(activityId, query = '') {
    if (!activityId) return { success: false, error: { message: 'Activity ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/affiliate-trips/activity/${activityId}${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['affiliate-trips', `activity-trips-${activityId}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Search affiliate trips
 */
export async function searchTrips(query = '', params = {}) {
    try {
        const queryStr = new URLSearchParams({ q: query, ...params }).toString();
        const responsePromise = fetch(`${baseUrl}/affiliate-trips/search?${queryStr}`, {
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
 * Get all available filter operations
 */
export async function getAllAvailableFilterOperations() {
    try {
        const responsePromise = fetch(`${baseUrl}/affiliate-trips/all-available-filter-operations`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['affiliate-trips-filters'] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get affiliate trip by ID
 */
export async function getTripById(id) {
    if (!id) return { success: false, error: { message: 'Trip ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/affiliate-trips/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['affiliate-trips', `affiliate-trip-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Trip not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get affiliate trip by slug
 */
export async function getTripBySlug(slug) {
    if (!slug) return { success: false, error: { message: 'Slug is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/affiliate-trips/slug/${slug}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['affiliate-trips', `affiliate-trip-slug-${slug}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Trip not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
