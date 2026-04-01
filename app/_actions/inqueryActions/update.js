'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Create a new inquiry
 */
export async function createInquery(data) {
    if (!data) return { success: false, error: { message: 'Inquiry data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/customer-inquery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Submission failed' } };

        updateTag('inquiries');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Reply to an inquiry
 */
export async function replyToInquiry(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/${id}/reply`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Reply failed' } };

        updateTag('inquiries');
        updateTag(`inquiry-${id}`);
        revalidatePath('/dashboard/inquiries');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update inquiry status
 */
export async function updateInqueryStatus(id, status) {
    if (!id || !status) return { success: false, error: { message: 'ID and status are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/${id}/update-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Status update failed' } };

        updateTag('inquiries');
        updateTag(`inquiry-${id}`);
        revalidatePath('/dashboard/inquiries');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk update inquiries
 */
export async function updateMultipleInquiry(ids, updates) {
    if (!ids || !updates) return { success: false, error: { message: 'IDs and updates are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/update-multiple`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, updates })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk update failed' } };

        updateTag('inquiries');
        revalidatePath('/dashboard/inquiries');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk delete inquiries
 */
export async function deleteMultipleInquiry(ids) {
    if (!ids || !ids.length) return { success: false, error: { message: 'IDs are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/delete-multiple`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk delete failed' } };

        updateTag('inquiries');
        revalidatePath('/dashboard/inquiries');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete inquiry by ID
 */
export async function deleteInquiry(id) {
    if (!id) return { success: false, error: { message: 'ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/delete/${id}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('inquiries');
        updateTag(`inquiry-${id}`);
        revalidatePath('/dashboard/inquiries');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
