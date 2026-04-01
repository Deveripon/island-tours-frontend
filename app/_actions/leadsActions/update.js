'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Create a new lead
 */
export async function createLead(data) {
    if (!data) return { success: false, error: { message: 'Lead data is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Creation failed' } };

        updateTag('leads');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update lead
 */
export async function updateLead(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('leads');
        updateTag(`lead-${id}`);
        revalidatePath('/dashboard/leads');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete lead
 */
export async function deleteLead(id) {
    if (!id) return { success: false, error: { message: 'ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/${id}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('leads');
        updateTag(`lead-${id}`);
        revalidatePath('/dashboard/leads');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete multiple leads
 */
export async function deleteMultipleLeads(ids) {
    if (!ids || !ids.length) return { success: false, error: { message: 'IDs are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/delete-multiple`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk delete failed' } };

        updateTag('leads');
        revalidatePath('/dashboard/leads');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Push lead to Zapier
 */
export async function pushLeadToZapier(leadId) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/push-lead-to-zapier`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId })
        });

        const response = await responsePromise;
        const result = await response.json();
        return response.ok ? { success: true, result } : { success: false, error: result };
    } catch (error) {
        return { success: false, error: { message: error?.message } };
    }
}

/**
 * Push lead to n8n
 */
export async function pushLeadTon8n(leadId) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/push-lead-to-n8n`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId })
        });

        const response = await responsePromise;
        const result = await response.json();
        return response.ok ? { success: true, result } : { success: false, error: result };
    } catch (error) {
        return { success: false, error: { message: error?.message } };
    }
}

/**
 * Push lead to Mailchimp
 */
export async function pushLeadToMailchimp(leadId) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/leads/push-lead-to-mailchimp/${leadId}`, {
            method: 'POST'
        });

        const response = await responsePromise;
        const result = await response.json();
        return response.ok ? { success: true, result } : { success: false, error: result };
    } catch (error) {
        return { success: false, error: { message: error?.message } };
    }
}
