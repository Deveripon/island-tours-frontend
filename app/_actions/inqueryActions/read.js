'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all inquiries with filtering and pagination
 */
export async function getAllInquiries(query = '') {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['inquiries'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch inquiries' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get inquiry by ID
 */
export async function getInquiryById(id) {
    if (!id) return { success: false, error: { message: 'Inquiry ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['inquiries', `inquiry-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Inquiry not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get inquiries by status
 */
export async function getInquiriesByStatus(status, limit = 50) {
    if (!status) return { success: false, error: { message: 'Status is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/status/${status}?limit=${limit}`, {
            method: 'GET',
            next: { revalidate: 0 }
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
 * Search inquiries
 */
export async function searchInquiries(query = '') {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/search?q=${query}`, {
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
 * Get inquiry stats
 */
export async function getInquiryStats() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/customer-inquery/stats`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['inquiry-stats'] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch stats' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
