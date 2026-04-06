'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Creates a new booking.
 */
export async function createBooking(data) {
    if (!data) return { success: false, error: { message: 'Invalid booking data provided' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/bookings`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['Bookings'] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to create booking' } };

        updateTag('Bookings');
        revalidatePath('/dashboard/bookings');

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update Booking by ID
 */
export async function updateBooking(id, data) {
    if (!id || !data) return { success: false, error: { message: 'Booking ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/bookings/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['Bookings', `booking-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to update booking' } };

        updateTag('Bookings');
        updateTag(`booking-${id}`);
        revalidatePath('/dashboard/bookings');

        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update Booking Status by ID
 */
export async function updateBookingStatus(id, data) {
    if (!id || !data) return { success: false, error: { message: 'Booking ID and status data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/bookings/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
            next: { tags: ['Bookings', `booking-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to update booking status' } };

        updateTag('Bookings');
        updateTag(`booking-${id}`);
        revalidatePath('/dashboard/bookings');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete Booking by ID
 */
export async function deleteBooking(id) {
    if (!id) return { success: false, error: { message: 'Booking ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/bookings/${id}`, {
            method: 'DELETE',
            next: { tags: ['Bookings', `booking-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to delete booking' } };

        updateTag('Bookings');
        updateTag(`booking-${id}`);
        revalidatePath('/dashboard/bookings');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
