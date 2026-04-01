/**
 * Helper function to handle file selection and update form data
 * with base64 encoded image
 */
export const handleFileUpload = (e, form, fieldName, maxSizeInMB = 5, onSuccess, onError) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        if (onError) onError(`File size exceeds ${maxSizeInMB}MB limit`);
        return;
    }

    // Read file as data URL (base64)
    const reader = new FileReader();
    reader.onload = event => {
        const base64 = event.target?.result;
        form.setValue(fieldName, base64, { shouldValidate: true });
        if (onSuccess) onSuccess(base64);
    };
    reader.onerror = () => {
        if (onError) onError('Error reading file');
    };
    reader.readAsDataURL(file);
};

/**
 * Helper function to handle multiple file uploads and update form data
 * with array of base64 encoded images
 */
export const handleMultipleFileUpload = (e, form, fieldName, maxSizeInMB = 5, maxFiles = 10, onSuccess, onError) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check number of files
    if (files.length > maxFiles) {
        if (onError) onError(`Maximum ${maxFiles} files allowed`);
        return;
    }

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const promises = [];

    // Process each file
    Array.from(files).forEach(file => {
        // Check file size
        if (file.size > maxSizeInBytes) {
            if (onError) onError(`File "${file.name}" exceeds ${maxSizeInMB}MB limit`);
            return;
        }

        // Read file as data URL (base64)
        const promise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                resolve(event.target?.result);
            };
            reader.onerror = () => {
                reject(`Error reading file "${file.name}"`);
            };
            reader.readAsDataURL(file);
        });

        promises.push(promise);
    });

    // When all files are processed
    Promise.all(promises)
        .then(base64Array => {
            // Get existing gallery images
            const existingImages = form.getValues(fieldName) || [];
            // Combine existing and new images
            const updatedImages = [...existingImages, ...base64Array];

            form.setValue(fieldName, updatedImages, { shouldValidate: true });
            if (onSuccess) onSuccess(base64Array);
        })
        .catch(error => {
            if (onError) onError(error);
        });
};

/**
 * Helper function to remove an item from an array in form data
 */
export const removeItemFromArray = (form, fieldName, index) => {
    const items = form.getValues(fieldName) || [];
    const updatedItems = [...items.slice(0, index), ...items.slice(index + 1)];
    form.setValue(fieldName, updatedItems, { shouldValidate: true });
};

/**
 * Helper function to add an item to an array in form data
 */
export const addItemToArray = (form, fieldName, item) => {
    const items = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...items, item], { shouldValidate: true });
};

/**
 * Helper function to update an item in an array in form data
 */
export const updateItemInArray = (form, fieldName, index, item) => {
    const items = form.getValues(fieldName) || [];
    const updatedItems = [...items];
    updatedItems[index] = item;
    form.setValue(fieldName, updatedItems, { shouldValidate: true });
};

/**
 * Helper function to handle array of strings
 * (e.g., for tags, categories, etc.)
 */
export const handleTagAddition = (form, fieldName, value) => {
    const tags = form.getValues(fieldName) || [];
    // Only add if not empty and not already in the array
    if (value.trim() !== '' && !tags.includes(value.trim())) {
        form.setValue(fieldName, [...tags, value.trim()], { shouldValidate: true });
    }
};

/**
 * Helper function to remove a tag from an array of strings
 */
export const handleTagRemoval = (form, fieldName, index) => {
    const tags = form.getValues(fieldName) || [];
    form.setValue(fieldName, [...tags.slice(0, index), ...tags.slice(index + 1)], { shouldValidate: true });
};

/**
 * Helper to move an item up in an array
 */
export const moveItemUp = (form, fieldName, index) => {
    if (index <= 0) return;
    const items = form.getValues(fieldName) || [];
    const updatedItems = [...items];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index - 1];
    updatedItems[index - 1] = temp;
    form.setValue(fieldName, updatedItems, { shouldValidate: true });
};

/**
 * Helper to move an item down in an array
 */
export const moveItemDown = (form, fieldName, index) => {
    const items = form.getValues(fieldName) || [];
    if (index >= items.length - 1) return;
    const updatedItems = [...items];
    const temp = updatedItems[index];
    updatedItems[index] = updatedItems[index + 1];
    updatedItems[index + 1] = temp;
    form.setValue(fieldName, updatedItems, { shouldValidate: true });
};

/**
 * Get Date string
 */
export const getDate = date => {
    return typeof date === 'string' ? new Date(date) : date;
};

