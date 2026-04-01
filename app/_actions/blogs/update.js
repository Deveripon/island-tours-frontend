'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag, revalidatePath } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Create a new blog post
 */
export async function createBlog(data) {
    if (!data) return { success: false, error: { message: 'Blog data is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Creation failed' } };

        updateTag('blogs');
        revalidatePath('/dashboard/blogs');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update blog post
 */
export async function updateBlog(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('blogs');
        updateTag(`blog-${id}`);
        revalidatePath('/dashboard/blogs');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk update blog status
 */
export async function bulkUpdateBlogStatus(ids, status) {
    if (!ids || !status) return { success: false, error: { message: 'IDs and status are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/bulk/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, status })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk status update failed' } };

        updateTag('blogs');
        revalidatePath('/dashboard/blogs');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete blog post
 */
export async function deleteBlog(id) {
    if (!id) return { success: false, error: { message: 'ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/${id}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('blogs');
        updateTag(`blog-${id}`);
        revalidatePath('/dashboard/blogs');

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Create a new comment
 */
export async function createComment(blogId, data) {
    if (!blogId || !data) return { success: false, error: { message: 'Blog ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/${blogId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Comment failed' } };

        updateTag('comments');
        updateTag(`blog-comments-${blogId}`);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update a comment
 */
export async function updateComment(commentId, data) {
    if (!commentId || !data) return { success: false, error: { message: 'Comment ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/${commentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('comments');
        updateTag(`comment-${commentId}`);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId) {
    if (!commentId) return { success: false, error: { message: 'Comment ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/${commentId}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('comments');
        updateTag(`comment-${commentId}`);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Like a comment
 */
export async function likeComment(commentId) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/${commentId}/like`, {
            method: 'POST'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Like failed' } };

        updateTag(`comment-${commentId}`);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Unlike a comment
 */
export async function unlikeComment(commentId) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/${commentId}/like`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Unlike failed' } };

        updateTag(`comment-${commentId}`);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Report a comment
 */
export async function reportComment(commentId, data) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/${commentId}/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Report failed' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk update comment status
 */
export async function bulkUpdateCommentStatus(ids, status) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/bulk/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, status })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk status update failed' } };

        updateTag('comments');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk delete comments
 */
export async function bulkDeleteComments(ids) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/bulk/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk delete failed' } };

        updateTag('comments');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update comment report status
 */
export async function updateCommentReportStatus(reportId, data) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/blogs/comments/reports/${reportId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
