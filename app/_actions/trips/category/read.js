'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all categories
 */
export async function getAllCategories(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/trips/categories${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['categories'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch categories' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get all categories by type
 */
export async function getAllCategoriesByType(type) {
    if (!type) return { success: false, error: { message: 'Type is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/trips/categories/type/${type}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['categories', `categories-type-${type}`] }
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
 * Search categories
 */
export async function searchCategories(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/trips/categories/search?q=${query}`, {
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
 * Get category by ID
 */
export async function getCategoryById(id) {
    if (!id) return { success: false, error: { message: 'Category ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/trips/categories/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['categories', `category-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Category not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
