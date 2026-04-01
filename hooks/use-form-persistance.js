import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function useFormPersistence({
    methods,
    localStorageKey,
    userId = 'anonymous',
}) {
    const isLoadingRef = useRef(false);

    // Simple serialization - only store URLs and metadata, not file data

    const serializeFormData = useCallback(data => {
        if (data === null || data === undefined) {
            return data;
        }

        // Skip File objects entirely - they should be uploaded to cloud first
        if (typeof File !== 'undefined' && data instanceof File) {
            return null;
        }

        // Handle arrays
        if (Array.isArray(data)) {
            return data
                .map(item => serializeFormData(item))
                .filter(item => item !== null);
        }

        // Handle objects
        if (typeof data === 'object') {
            const serialized = {};
            for (const [key, value] of Object.entries(data)) {
                const serializedValue = serializeFormData(value);
                if (serializedValue !== null) {
                    serialized[key] = serializedValue;
                }
            }
            return serialized;
        }

        return data;
    }, []);

    // Load data from localStorage on mount
    useEffect(() => {
        const loadData = async () => {
            if (isLoadingRef.current) return;
            isLoadingRef.current = true;

            try {
                const savedData = localStorage.getItem(localStorageKey);
                if (savedData) {
                    const parsedData = JSON.parse(savedData);

                    // Reset form with loaded data
                    methods.reset(parsedData);

                    // Validate after loading with a small delay
                    setTimeout(() => {
                        methods.trigger().catch(error => {});
                    }, 100);
                }
            } catch (error) {
                // Clear corrupted data
                localStorage.removeItem(localStorageKey);
                toast.error('Corrupted draft data cleared. Starting fresh.');
            } finally {
                isLoadingRef.current = false;
            }
        };

        loadData();
    }, [methods, localStorageKey]);

    // Auto-save with debounce
    useEffect(() => {
        let debounceTimer;

        const debouncedSave = () => {
            if (isLoadingRef.current) return; // Don't save while loading

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                try {
                    const data = methods.getValues();
                    const serializedData = serializeFormData(data);

                    // Add metadata
                    const draftData = {
                        ...serializedData,
                    };
                    const dataString = JSON.stringify(draftData);
                    const sizeKB = Math.round(dataString.length / 1024);

                    // Warn if data is getting large (shouldn't happen with cloud images)
                    if (sizeKB > 100) {
                    }

                    localStorage.setItem(localStorageKey, dataString);
                } catch (error) {
                    if (error.name === 'QuotaExceededError') {
                        toast.error(
                            'Storage quota exceeded. Please clear browser data or reduce form size.'
                        );
                    } else {
                    }
                }
            }, 500); // .5 second debounce
        };

        const subscription = methods.watch(() => {
            debouncedSave();
        });

        return () => {
            clearTimeout(debounceTimer);
            subscription.unsubscribe();
        };
    }, [methods, localStorageKey, userId, serializeFormData]);

    // Manual save draft
    const handleSaveDraft = async () => {
        try {
            const data = methods.getValues();
            const serializedData = serializeFormData(data);

            const draftData = {
                ...serializedData,
            };
            localStorage.setItem(localStorageKey, JSON.stringify(draftData));
        } catch (error) {
            toast.error('Failed to save draft. Please try again.');
        }
    };

    // Clear draft
    const clearDraft = () => {
        try {
            localStorage.removeItem(localStorageKey);
            // Don't show toast here as it might interfere with other success messages
        } catch (error) {
            toast.error('Error clearing draft.');
        }
    };

    // Get draft info
    const getDraftInfo = () => {
        try {
            const savedData = localStorage.getItem(localStorageKey);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                return {
                    exists: true,
                };
            }
            return { exists: false };
        } catch (error) {
            return { exists: false, error: error.message };
        }
    };

    return {
        handleSaveDraft,
        clearDraft,
        getDraftInfo,
    };
}

