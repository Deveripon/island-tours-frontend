'use server';

import { fetchWithAuth } from '@/utils/fetch-with-auth';
import { updateTag } from 'next/cache';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Upload Single Image (Cloudinary)
 */
export async function uploadSingleImage(file, options = {}) {
    if (!file) return { success: false, error: { message: 'No file provided' } };

    const {
        folder = 'drafts',
        userId = 'anonymous',
        tags = [],
        publicId = null,
    } = options;

    try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);
        formData.append('userId', userId);
        if (tags.length > 0) formData.append('tags', JSON.stringify(tags));
        if (publicId) formData.append('publicId', publicId);

        const responsePromise = fetch(`${baseUrl}/upload/image`, {
            method: 'POST',
            body: formData
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Upload failed' } };
        
        updateTag('media');
        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred during upload' } };
    }
}

/**
 * Upload Multiple Images (Cloudinary + Media Gallery)
 */
export async function uploadMultipleImage(files, options = {}) {
    if (!files || !files.length) return { success: false, error: { message: 'No files provided' } };

    const { folder = 'drafts', userId = 'anonymous', tags = [] } = options;

    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('gallery', file);
        });
        formData.append('folder', folder);
        formData.append('userId', userId);
        if (tags.length > 0) formData.append('tags', JSON.stringify(tags));

        const responsePromise = fetchWithAuth(`${baseUrl}/upload/image/multiple`, {
            method: 'POST',
            body: formData
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Multiple upload failed' } };

        updateTag('media');
        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred during upload' } };
    }
}

/**
 * Move Image to Folder
 */
export async function moveImage(publicId, newFolder, userId) {
    if (!publicId || !newFolder) return { success: false, error: { message: 'ID and folder are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/upload/image/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId, newFolder, userId })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Move failed' } };

        updateTag('media');
        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Cleanup Old Drafts
 */
export async function cleanupOldDrafts(hours = 24) {
    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/upload/cleanup-old-drafts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hours })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Cleanup failed' } };

        updateTag('media');
        return { success: true, ...result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Update Media Information (DB)
 */
export async function updateMedia(id, data) {
    if (!id || !data) return { success: false, error: { message: 'ID and data are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Update failed' } };

        updateTag('media');
        updateTag(`media-${id}`);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk Update Media Information (DB)
 */
export async function bulkUpdateMedia(ids, updates) {
    if (!ids || !updates) return { success: false, error: { message: 'IDs and updates are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery/bulk/update`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids, updates })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk update failed' } };

        updateTag('media');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete Media by ID (DB)
 */
export async function deleteMedia(id) {
    if (!id) return { success: false, error: { message: 'ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery/${id}`, {
            method: 'DELETE'
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('media');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Bulk Delete Media (DB)
 */
export async function bulkDeleteMedia(ids) {
    if (!ids || !ids.length) return { success: false, error: { message: 'IDs are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/media-gallery/bulk/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk delete failed' } };

        updateTag('media');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete Single Image (Cloudinary)
 */
export async function deleteSingleImage(publicId) {
    if (!publicId) return { success: false, error: { message: 'Public ID is required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/upload/image/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Delete failed' } };

        updateTag('media');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}

/**
 * Delete Multiple Images (Cloudinary)
 */
export async function deleteImages(publicIds) {
    if (!publicIds || !publicIds.length) return { success: false, error: { message: 'Public IDs are required' } };

    try {
        const responsePromise = fetchWithAuth(`${baseUrl}/upload/image/delete/multiple`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicIds })
        });

        const response = await responsePromise;
        const result = await response.json();

        if (!response.ok) return { success: false, error: { message: result?.message || 'Bulk delete failed' } };

        updateTag('media');
        return { success: true, result };
    } catch (error) {
        return { success: false, error: { message: error?.message || 'An error occurred' } };
    }
}
