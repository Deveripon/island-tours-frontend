'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all leads with filtering and pagination
 */
export async function getAllLeads(query = '') {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['leads'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch leads' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get lead by ID
 */
export async function getLeadById(id) {
    if (!id) return { success: false, error: { message: 'Lead ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['leads', `lead-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Lead not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Search leads
 */
export async function searchLeads(query = '') {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/search?q=${query}`, {
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
 * Get lead statistics
 */
export async function getLeadStats() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/stats`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['leads-stats'] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch stats' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
