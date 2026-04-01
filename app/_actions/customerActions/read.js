'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all B2C Customers
 */
export async function getB2cCustomers() {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/b2c-customer`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['customers'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch customers' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get B2C Customer by ID
 */
export async function getB2cCustomerById(id) {
    if (!id) return { success: false, error: { message: 'Customer ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/b2c-customer/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['customers', `customer-${id}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch customer' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Customer by Email
 */
export async function getCustomerByEmail(email) {
    if (!email) return { success: false, error: { message: 'Email is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/b2c-customer/email/${email}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['customers', `customer-email-${email}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Customer not found' } };

        return { success: true, user: result.data };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
