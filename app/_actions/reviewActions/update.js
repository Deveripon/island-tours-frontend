'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Submit a new review
 */
export async function createReview(data) {
    if (!data) return { success: false, error: { message: 'Review data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Submission failed' } };

        updateTag('reviews');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update review content/rating
 */
export async function updateReview(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/reviews/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('reviews');
        updateTag(`review-${id}`);
        revalidatePath('/dashboard/reviews');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update review status (Approve/Reject)
 */
export async function updateReviewStatus(id, status) {
    if (!id || !status) return { success: false, error: { message: 'ID and status are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/reviews/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Status update failed' } };

        updateTag('reviews');
        updateTag(`review-${id}`);
        revalidatePath('/dashboard/reviews');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk update review statuses
 */
export async function bulkUpdateReviewStatus(ids, status) {
    if (!ids || !status) return { success: false, error: { message: 'IDs and status are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/reviews/bulk-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, status })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk status update failed' } };

        updateTag('reviews');
        revalidatePath('/dashboard/reviews');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete review by ID
 */
export async function deleteReview(id) {
    if (!id) return { success: false, error: { message: 'ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/reviews/${id}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('reviews');
        updateTag(`review-${id}`);
        revalidatePath('/dashboard/reviews');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk delete reviews
 */
export async function bulkDeleteReviews(ids) {
    if (!ids || !ids.length) return { success: false, error: { message: 'IDs are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/reviews/bulk-delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk delete failed' } };

        updateTag('reviews');
        revalidatePath('/dashboard/reviews');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
