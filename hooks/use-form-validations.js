import { useCallback } from 'react';
import { toast } from 'sonner';

/**
 * A minimal form validation hook that provides utilities for manual validation
 * without automatic effects that might cause excessive renders
 */
export function useFormValidation({ methods, formSchema, fieldToTabMapping }) {
    // Helper function to recursively collect error messages
    const collectErrorMessages = useCallback((errors, parentPath = '') => {
        const messages = [];

        Object.entries(errors).forEach(([key, error]) => {
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            if (error?.message) {
                messages.push({ path: currentPath, message: error.message });
            } else if (Array.isArray(error)) {
                error.forEach((item, index) => {
                    if (typeof item === 'object' && item !== null) {
                        messages.push(
                            ...collectErrorMessages(
                                item,
                                `${currentPath}[${index}]`
                            )
                        );
                    }
                });
            } else if (typeof error === 'object' && error !== null) {
                messages.push(...collectErrorMessages(error, currentPath));
            }
        });

        return messages;
    }, []);

    // Function to get the tab ID for a field path
    const getTabIdForPath = useCallback(
        path => {
            // Try exact match first
            if (fieldToTabMapping[path]) {
                return fieldToTabMapping[path];
            }

            // Try to match parent paths
            const pathParts = path.split('.');
            while (pathParts.length > 0) {
                const parentPath = pathParts.join('.');
                if (fieldToTabMapping[parentPath]) {
                    return fieldToTabMapping[parentPath];
                }
                pathParts.pop();
            }

            // Try to match array paths (e.g., "highlights[0].title" -> "highlights")
            const arrayMatch = path.match(/^([^[]+)/);
            if (arrayMatch && fieldToTabMapping[arrayMatch[1]]) {
                return fieldToTabMapping[arrayMatch[1]];
            }

            return undefined;
        },
        [fieldToTabMapping]
    );

    // Function to get tabs with errors - call this manually when needed
    const getTabsWithErrors = useCallback(() => {
        const errors = methods.formState.errors;
        const tabsWithErrors = new Set();

        Object.keys(errors).forEach(fieldName => {
            const tabId = getTabIdForPath(fieldName);
            if (tabId) {
                tabsWithErrors.add(tabId);
            }
        });

        return Array.from(tabsWithErrors);
    }, [methods.formState.errors, getTabIdForPath]);

    // Function to show errors for a specific tab
    const showTabErrors = useCallback(
        tabId => {
            const errors = methods.formState.errors;
            const allErrorMessages = collectErrorMessages(errors);
            const tabErrorMessages = allErrorMessages.filter(({ path }) => {
                const errorTabId = getTabIdForPath(path);
                return errorTabId === tabId;
            });

            // Show errors as toasts
            if (tabErrorMessages.length > 0) {
                const shownMessages = new Set(); // To prevent duplicate messages

                tabErrorMessages.forEach(({ message }) => {
                    if (!shownMessages.has(message)) {
                        shownMessages.add(message);
                        toast.error(message, {
                            style: {
                                backgroundColor: 'var(--color-red-100)',
                                color: 'var(--color-red-800)',
                                border: '1px solid var(--color-red-200)',
                            },
                            id: `error-${message.substring(0, 10)}`, // Use part of message as ID
                        });
                    }
                });
            }

            return tabErrorMessages.length > 0;
        },
        [methods.formState.errors, collectErrorMessages, getTabIdForPath]
    );

    // Validate the entire form
    const validateEntireForm = useCallback(async () => {
        try {
            return await methods.trigger();
        } catch (error) {
            return false;
        }
    }, [methods]);

    // Validate a specific section
    const validateCurrentSection = useCallback(
        async activeTab => {
            try {
                // Trigger validation for all fields in the current tab
                const fieldsInCurrentTab = Object.entries(fieldToTabMapping)
                    .filter(([_, tabId]) => tabId === activeTab)
                    .map(([fieldName]) => fieldName);

                if (fieldsInCurrentTab.length === 0) {
                    return true; // No fields to validate in this tab
                }

                return await methods.trigger(fieldsInCurrentTab, {
                    shouldFocus: true,
                });
            } catch (error) {
                return false;
            }
        },
        [methods, fieldToTabMapping]
    );

    // Validate a specific field or array of fields
    const validateFields = useCallback(
        async fields => {
            try {
                return await methods.trigger(fields);
            } catch (error) {
                return false;
            }
        },
        [methods]
    );

    // Check if a specific tab has errors without showing toasts
    const hasTabErrors = useCallback(
        tabId => {
            const errors = methods.formState.errors;
            const errorKeys = Object.keys(errors);

            for (const key of errorKeys) {
                if (getTabIdForPath(key) === tabId) {
                    return true;
                }
            }

            return false;
        },
        [methods.formState.errors, getTabIdForPath]
    );
    const tabsWithErrors = getTabsWithErrors();

    return {
        getTabsWithErrors,
        validateEntireForm,
        validateCurrentSection,
        validateFields,
        showTabErrors,
        hasTabErrors,
        tabsWithErrors,
        formState: methods.formState, // Expose formState for consumer to check errors
    };
}

