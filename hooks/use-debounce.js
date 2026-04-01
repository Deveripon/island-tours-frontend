'use client';

import { useEffect, useState } from 'react';

/**
 * A hook that delays updating a value until a specified amount of time has passed
 * since the last call. Useful for preventing excessive renders on fast-changing values.
 */
export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timeout to update the debounced value after the delay
        const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

        // Clear the timeout if the value changes before the delay expires
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

