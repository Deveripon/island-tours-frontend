'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get All Payments
 */
export async function getAllPayments(query = '') {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['payments'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch payments' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Search Payments
 */
export async function searchPayments(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/payments/search?q=${query}`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Search failed' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Payment by ID
 */
export async function getPaymentById(id) {
    if (!id) return { success: false, error: { message: 'Payment ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['payments', `payment-${id}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch payment' } };

        return { success: true, user: result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Payment by Booking ID
 */
export async function getPaymentByBookingId(bookingId) {
    if (!bookingId) return { success: false, error: { message: 'Booking ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/payments/booking/${bookingId}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['payments', `payment-booking-${bookingId}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch payment by booking' } };

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Payment by Transaction ID
 */
export async function getPaymentByTransactionId(transactionId) {
    if (!transactionId) return { success: false, error: { message: 'Transaction ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/payments/transaction/${transactionId}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['payments', `payment-tx-${transactionId}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch payment by transaction' } };

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Payment by Booking Reference
 */
export async function getPaymentByBookingReference(reference) {
    if (!reference) return { success: false, error: { message: 'Reference is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/payments/bookingReference/${reference}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['payments', `payment-ref-${reference}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch payment by reference' } };

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Payments by Customer ID
 */
export async function getPaymentsByCustomerId(customerId) {
    if (!customerId) return { success: false, error: { message: 'Customer ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/payments/customer/${customerId}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['payments', `customer-payments-${customerId}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch customer payments' } };

        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
