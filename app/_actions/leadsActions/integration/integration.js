'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag } from 'next/cache';

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Push Bulk Leads to Zapier
 */
export async function pushLeadsToZapier(leadIds) {
    if (!leadIds) return { success: false, error: { message: 'IDs are required' } };

    console.log(`pushing leads to zapier`, leadIds);

    try {
        const responsePromise = fetchWithAuth(`${baseurl}/leads/push-bulk-lead-to-zapier`, {
            method: 'POST',
            body: JSON.stringify(leadIds),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['leads'] }
        });

        const response = await responsePromise;
        console.log(`response`, response);

        const data = await response.json();
        console.log(`data`, data);

        if (!response.ok) return { success: false, error: { message: data?.message || 'Zapier push failed' } };

        // Assuming integration might update some status in our DB
        updateTag('leads');

        return { success: true, data };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Push Bulk Leads to n8n
 */
export async function pushLeadsTon8n(leadIds) {
    if (!leadIds) return { success: false, error: { message: 'IDs are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseurl}/leads/push-bulk-lead-to-n8n`, {
            method: 'POST',
            body: JSON.stringify(leadIds),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['leads'] }
        });

        const response = await responsePromise;
        const data = await response.json();

        if (!response.ok) return { success: false, error: { message: data?.message || 'n8n push failed' } };

        updateTag('leads');

        return { success: true, data };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Push a Lead to Mailchimp
 */

export async function pushLeadToMailchimp(leadId) {
    try {
        const response = await fetchWithAuth(
            `${baseurl}/leads/push-lead-to-mailchimp/${leadId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 0, tags: ['leads'] },
            }
        );
        const data = await response.json();
        if (response.ok) {
            return {
                success: true,
                data,
            };
        } else {
            return {
                success: false,
                error: {
                    message: data?.message,
                },
            };
        }
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
}


/**
 * Push Bulk Leads to Mailchimp
 */
export async function pushBulkLeadsToMailchimp(leadIds) {
    try {
        const response = await fetchWithAuth(
            `${baseurl}/leads/push-bulk-lead-to-mailchimp`,
            {
                method: 'POST',
                body: JSON.stringify({ leadIds: leadIds }),
                headers: {
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 0, tags: ['leads'] },
            }
        );
        const data = await response.json();
        if (response.ok) {
            return {
                success: true,
                data,
            };
        } else {
            return {
                success: false,
                error: {
                    message: data?.message,
                },
            };
        }
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
}

/**
 * Push All Leads to Mailchimp
 */
export async function pushAllLeadToMailchimp() {

    try {
        const response = await fetchWithAuth(
            `${baseurl}/leads/push-all-lead-to-mailchimp`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                next: { revalidate: 0, tags: ['leads'] },
            }
        );
        const data = await response.json();
        if (response.ok) {
            return {
                success: true,
                data,
            };
        } else {
            return {
                success: false,
                error: {
                    message: data?.message,
                },
            };
        }
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
}
