import { useCallback, useState } from 'react';
// Demo data - in production, replace with actual API call
export const demoLocations = [
    { label: 'Bangkok, Thailand', value: 'bangkok_thailand' },
    { label: 'Chiang Mai, Thailand', value: 'chiang_mai_thailand' },
    { label: 'Phuket, Thailand', value: 'phuket_thailand' },
    { label: 'Tokyo, Japan', value: 'tokyo_japan' },
    { label: 'Kyoto, Japan', value: 'kyoto_japan' },
    { label: 'Bali, Indonesia', value: 'bali_indonesia' },
    { label: 'Singapore', value: 'singapore' },
    { label: 'Seoul, South Korea', value: 'seoul_south_korea' },
    { label: 'Hong Kong', value: 'hong_kong' },
    { label: 'Sydney, Australia', value: 'sydney_australia' },
    { label: 'Melbourne, Australia', value: 'melbourne_australia' },
    { label: 'New York, USA', value: 'new_york_usa' },
    { label: 'London, UK', value: 'london_uk' },
    { label: 'Paris, France', value: 'paris_france' },
    { label: 'Rome, Italy', value: 'rome_italy' },
    { label: 'Barcelona, Spain', value: 'barcelona_spain' },
];
export function useLocationSearch() {
    const [locations, setLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchLocations = useCallback(async query => {
        if (!query || query.length < 2) {
            setLocations([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Here we would normally fetch from an API
            // Example API: https://api.example.com/locations?q=${query}

            // For now, we'll simulate an API call with a timeout and some demo data
            await new Promise(resolve => setTimeout(resolve, 500));

            // Filter demo locations based on query
            const filteredLocations = demoLocations.filter(location =>
                location.label.toLowerCase().includes(query.toLowerCase())
            );

            setLocations(filteredLocations);
        } catch (err) {
            setError('Failed to fetch locations. Please try again.');
            setLocations([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        locations,
        isLoading,
        error,
        searchLocations,
    };
}

