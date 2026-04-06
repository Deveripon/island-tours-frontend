'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Get all blogs with filtering
 */
export async function getAllBlogs(query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/blogs${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['blogs'] }
        });

        const response = await responsePromise;
        if (!response) return { success: false, error: { message: 'Network request failed' } };

        const result = await response.json();
        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch blogs' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get blogs by user ID
 */
export async function getBlogsByUserId(userId, query = '') {
    if (!userId) return { success: false, error: { message: 'User ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/blogs/user/${userId}${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['blogs', `user-blogs-${userId}`] }
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
 * Get related blogs by slug
 */
export async function getRelatedBlogs(slug) {
    if (!slug) return { success: false, error: { message: 'Slug is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/blogs/related/${slug}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['blogs', `related-blogs-${slug}`] }
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
 * Search blogs
 */
export async function searchBlogs(query = '', params = {}) {
    try {
        const queryStr = new URLSearchParams({ q: query, ...params }).toString();
        const responsePromise = fetch(`${baseUrl}/blogs/search?${queryStr}`, {
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
 * Get blog by ID
 */
export async function getBlogById(id) {
    if (!id) return { success: false, error: { message: 'Blog ID is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/blogs/${id}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['blogs', `blog-${id}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Blog not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get blog by slug
 */
export async function getBlogBySlug(slug) {
    if (!slug) return { success: false, error: { message: 'Slug is required' } };

    try {
        const responsePromise = fetch(`${baseUrl}/blogs/slug/${slug}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['blogs', `blog-slug-${slug}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Blog not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get blog analytics
 */
export async function getBlogAnalytics(id) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/${id}/analytics`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch analytics' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get all comments for a blog
 */
export async function getAllComments(blogId, query = '') {
    try {
        const responsePromise = fetch(`${baseUrl}/blogs/${blogId}/comments${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['comments', `blog-comments-${blogId}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch comments' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get single comment
 */
export async function getCommentById(commentId) {
    try {
        const responsePromise = fetch(`${baseUrl}/blogs/comments/${commentId}`, {
            method: 'GET',
            next: { revalidate: 3600, tags: ['comments', `comment-${commentId}`] }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Comment not found' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Get all comment reports
 */
export async function getAllCommentReports(query = '') {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/reports${query ? `?${query}` : ''}`, {
            method: 'GET',
            next: { revalidate: 0 }
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Failed to fetch reports' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
