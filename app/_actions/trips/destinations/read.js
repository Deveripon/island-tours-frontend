'use server';


const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all destinations
 */
export async function getAllDestinations() {
    try {
        const responsePromise = fetch(`${baseUrl}/destinations`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['destinations'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch destinations' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Search destinations
 */
export async function searchDestinations(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/destinations/search?q=${query}`, {
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
 * Get destination by ID
 */
export async function getDestinationById(id) {
    if (!id) return { success: false, error: { message: 'Destination ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/destinations/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['destinations', `destination-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Destination not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
