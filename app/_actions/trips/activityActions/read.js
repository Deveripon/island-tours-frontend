'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all activities
 */
export async function getAllActivities(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/activities${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['activities'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch activities' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get activities by creator ID
 */
export async function getActivitiesByCreatorId(creatorId) {
    if (!creatorId) return { success: false, error: { message: 'Creator ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/activities/creator/${creatorId}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['activities', `creator-activities-${creatorId}`] }
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
 * Get highlighted activities
 */
export async function getHighlightedActivities() {
    try {
        const responsePromise = fetch(`${baseUrl}/activities/highlights`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['activities', 'activities-highlights'] }
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
 * Get activities by difficulty level
 */
export async function getActivitiesByDifficulty(difficulty) {
    if (!difficulty) return { success: false, error: { message: 'Difficulty is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/activities/difficulty/${difficulty}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['activities', `activities-${difficulty}`] }
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
 * Search activities
 */
export async function searchActivities(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/activities/search?q=${query}`, {
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
 * Get activity by ID
 */
export async function getActivityById(id) {
    if (!id) return { success: false, error: { message: 'Activity ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/activities/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['activities', `activity-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Activity not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
