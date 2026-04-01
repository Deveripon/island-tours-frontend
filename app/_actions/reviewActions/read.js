'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all reviews with filtering and pagination
 */
export async function getAllReviews(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/reviews${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['reviews'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch reviews' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get pending reviews count
 */
export async function getPendingReviewsCount() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/reviews/pending-count`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch count' } };

        return { success: true, count: result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get single review by ID
 */
export async function getReviewById(id) {
    if (!id) return { success: false, error: { message: 'Review ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/reviews/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['reviews', `review-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Review not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
