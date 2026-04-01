import { base64ToFile } from '@/lib/utils';

// Helper to safely get a nested property's value, with fallback
export function getNestedValue(obj, path, fallback = undefined) {
    const keys = path.split('.');
    return keys.reduce((acc, key) => {
        if (acc === undefined) return fallback;
        if (acc === null) return fallback;
        return acc[key] === undefined ? fallback : acc[key];
    }, obj);
}

// Helper to update a nested property in a form data object
export function updateNestedValue(formData, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
    }, formData);

    target[lastKey] = value;
    return { ...formData };
}

// Helper to update an array item at a specific index
export function updateArrayItem(array, index, updatedItem) {
    return array.map((item, i) =>
        i === index ? { ...item, ...updatedItem } : item
    );
}

// Helper to add an item to an array
export function addArrayItem(array, newItem) {
    return [...array, newItem];
}

// Helper to remove an item from an array at specific index
export function removeArrayItem(array, index) {
    return array.filter((_, i) => i !== index);
}

// Helper to reorder array items (e.g. drag and drop)
export function reorderArrayItems(array, startIndex, endIndex) {
    const result = Array.from(array);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
}

// Convert file to base64 for preview or storage
export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Format currency for display
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

// Parse date and format it for display
export function formatDate(dateString, format = 'short', locale = 'en-US') {
    if (!dateString) return '';

    const date = new Date(dateString);
    const options =
        format === 'short'
            ? { month: 'short', day: 'numeric', year: 'numeric' }
            : {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
              };

    return date.toLocaleDateString(locale, options);
}

// Convert a JavaScript date to ISO string (date only part)
export function dateToISOString(date) {
    return date.toISOString().split('T')[0];
}

// Generate a template/empty object based on a defined structure
export function createEmptyObject(template) {
    if (Array.isArray(template)) {
        return [];
    }

    if (typeof template === 'object' && template !== null) {
        const result = {};

        Object.keys(template).forEach(key => {
            const value = template[key];

            if (Array.isArray(value)) {
                result[key] = [];
            } else if (typeof value === 'object' && value !== null) {
                result[key] = createEmptyObject(value);
            } else {
                if (typeof value === 'string') result[key] = '';
                else if (typeof value === 'number') result[key] = 0;
                else if (typeof value === 'boolean') result[key] = false;
                else result[key] = null;
            }
        });

        return result;
    }

    return template;
}

// Helper function to get File objects from form data for uploading
export const getFilesForUpload = (formData, fieldName) => {
    const imageData = formData[fieldName];

    if (!imageData) return [];

    const images = Array.isArray(imageData) ? imageData : [imageData];

    return images
        .map(item => {
            if (item instanceof File) {
                // Already a File object
                return item;
            } else if (item && typeof item === 'object' && item.data) {
                // Convert persisted base64 data back to File
                return base64ToFile(item);
            }
            return null;
        })
        .filter(Boolean);
};

// Example usage in your form submission:
export const handleFormSubmit = async formData => {
    try {
        // Get File objects for upload
        const mainImageFile = getFilesForUpload(formData, 'mainImage')[0];
        const galleryImageFiles = getFilesForUpload(formData, 'galleryImages');

        // Upload to Cloudinary
        let mainImageUrl = '';
        let galleryImageUrls = [];

        if (mainImageFile) {
            const mainImageFormData = new FormData();
            mainImageFormData.append('file', mainImageFile);
            mainImageFormData.append('upload_preset', 'your_upload_preset');

            const mainImageResponse = await fetch(
                'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
                {
                    method: 'POST',
                    body: mainImageFormData,
                }
            );
            const mainImageResult = await mainImageResponse.json();
            mainImageUrl = mainImageResult.secure_url;
        }

        if (galleryImageFiles.length > 0) {
            const galleryUploadPromises = galleryImageFiles.map(async file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'your_upload_preset');

                const response = await fetch(
                    'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                const result = await response.json();
                return result.secure_url;
            });

            galleryImageUrls = await Promise.all(galleryUploadPromises);
        }

        // Now submit your form with the image URLs
        const finalFormData = {
            ...formData,
            mainImage: mainImageUrl,
            galleryImages: galleryImageUrls,
        };
    } catch (error) {}
};

export function formatDateForInput(dateValue) {
    if (!dateValue) return '';

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    } catch (error) {
        return '';
    }
}

