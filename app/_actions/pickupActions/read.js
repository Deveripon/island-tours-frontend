'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all pickup locations by trip ID
 */
export async function getPickupsByTripId(tripId) {
    if (!tripId) return { success: false, error: { message: 'Trip ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/pickups/trip/${tripId}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['pickups', `trip-pickups-${tripId}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch pickups' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Search pickup locations
 */
export async function searchPickups(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/pickups/search?q=${query}`, {
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
 * Get pickup location by ID
 */
export async function getPickupById(id) {
    if (!id) return { success: false, error: { message: 'Pickup ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/pickups/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['pickups', `pickup-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Pickup not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
