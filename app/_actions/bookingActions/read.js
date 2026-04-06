'use server';

import { fetchWithAuth } from "@/utils/fetch-with-auth";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get All Bookings
 */
export async function getAllBookings(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/bookings${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: {
                revalidate: 3600,
                tags: ['Bookings'],
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch bookings' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get All Bookings of a specific User
 */
export async function getBookingsByUserId(userId) {
    if (!userId) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/bookings/customer/${userId}`, {
            method: 'GET',
            next: {
                revalidate: 3600,
                tags: ['Bookings', `user-bookings-${userId}`],
            }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch user bookings' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Booking by ID
 */
export async function getBookingById(id) {
    if (!id) return { success: false, error: { message: 'Booking ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/bookings/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['Bookings', `booking-${id}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch booking' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Booking by Reference
 */
export async function getBookingByReference(reference) {
    if (!reference) return { success: false, error: { message: 'Reference is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/bookings/reference/${reference}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['Bookings', `booking-ref-${reference}`] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch booking by reference' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get Booking by Stripe Session ID
 */
export async function getBookingByStripeSessionId(sessionId) {
    if (!sessionId) return { success: false, error: { message: 'Session ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/bookings/affiliate/session/${sessionId}`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const data = await response.json();

        if (!response.ok) return { success: false, error: { message: data?.message || 'Failed to fetch booking by session' } };

        return { success: true, data };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get all received bookings of trip creator
 */
export async function getReceivedBookingsByUserId(userId) {
    if (!userId) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/bookings/user/trip/creator/${userId}`, {
            method: 'GET',
            next: {
                revalidate: 3600,
                tags: ['Bookings', `received-bookings-${userId}`],
            }
        });

        const response = await responsePromise;
        if (!response.ok) return { success: false, error: { message: 'Failed to fetch received bookings' } };

        const result = await response.json();
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Download Receipt
 */
export async function downloadReceipt(bookingId) {
    if (!bookingId) return { success: false, error: { message: 'Booking ID is required' } };

    try {
        const response = await fetch(`${baseUrl}/invoices/generate/${bookingId}`, {
            method: 'GET',
            headers: { Accept: 'application/pdf' },
            next: { revalidate: 0 }
        });

        if (!response.ok) return { success: false, error: { message: 'Failed to generate invoice' } };

        return { success: true, message: 'Invoice generated successfully' };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'Failed to generate receipt' } };
    }
}
