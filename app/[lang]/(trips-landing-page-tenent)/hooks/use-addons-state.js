import { useCallback, useState } from 'react';

export const useAddonState = () => {
    const [selectedAddons, setSelectedAddons] = useState([]);

    const updateSelectedAddons = useCallback((addon, action = 'toggle') => {
        if (action === 'clear_all') {
            setSelectedAddons([]);
            return;
        }

        if (!addon) return;

        setSelectedAddons(prevAddons => {
            const existingIndex = prevAddons.findIndex(
                existing => existing.id === addon.id
            );

            if (existingIndex !== -1) {
                // Remove addon if already selected
                return prevAddons.filter(existing => existing.id !== addon.id);
            } else {
                // Add addon if not selected
                return [...prevAddons, addon];
            }
        });
    }, []);

    return {
        selectedAddons,
        updateSelectedAddons,
        setSelectedAddons,
    };
};

