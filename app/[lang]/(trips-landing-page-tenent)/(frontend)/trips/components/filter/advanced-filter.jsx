'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

const AdvancedTripFilter = ({ availablefilterOptions }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const debounceRef = useRef(null);
    const isInitialMount = useRef(true);
    const isUpdatingFromURL = useRef(false);
    const { data: session } = useSession();
    const [showAllTourTypes, setShowAllTourTypes] = useState(false);
    const [showAllSuitableFor, setShowAllSuitableFor] = useState(false);
    const [showAllCurrencies, setShowAllCurrencies] = useState(false);
    const [showAllTourStyles, setShowAllTourStyles] = useState(false);

    const FILTER_PARAMS = useMemo(
        () => [
            'country',
            'tourType',
            'suitableFor',
            'duration',
            'difficulty',
            'tourStyle',
            'currency',
            'mostPopular',
            'minPrice',
            'maxPrice',
            'minRating',
        ],
        []
    );

    const filterOptions = availablefilterOptions;
    const getInitialFilters = useCallback(() => {
        return {
            destination: searchParams.get('destination') || '',
            country: searchParams.get('country') || '',
            tourType: searchParams.get('tourType')
                ? searchParams.get('tourType').split(',')
                : [],
            startDate: searchParams.get('startDate') || '',
            suitableFor: searchParams.get('suitableFor')
                ? searchParams.get('suitableFor').split(',')
                : [],
            duration: searchParams.get('duration') || '',
            difficulty: searchParams.get('difficulty') || '',
            tourStyle: searchParams.get('tourStyle') || '',
            currency: searchParams.get('currency') || '',
            mostPopular: searchParams.get('mostPopular') === 'true',
            minPrice: parseInt(searchParams.get('minPrice')) || 0,
            maxPrice: parseInt(searchParams.get('maxPrice')) || 200000,
            minRating: parseFloat(searchParams.get('minRating')) || 0,
            guests: {
                adults: parseInt(searchParams.get('adults')) || 1,
                children: parseInt(searchParams.get('children')) || 0,
                infants: parseInt(searchParams.get('infants')) || 0,
            },
        };
    }, [searchParams]);

    const [filters, setFilters] = useState(getInitialFilters);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    // Only sync from URL on initial mount or when URL changes externally
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        // Skip if we're the ones updating the URL
        if (isUpdatingFromURL.current) {
            isUpdatingFromURL.current = false;
            return;
        }

        const newFilters = getInitialFilters();
        setFilters(newFilters);
    }, [searchParams, getInitialFilters]);

    const updateSearchParams = useCallback(
        newFilters => {
            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(() => {
                isUpdatingFromURL.current = true;

                const params = new URLSearchParams(window.location.search);

                FILTER_PARAMS.forEach(key => params.delete(key));

                if (newFilters.country)
                    params.set('country', newFilters.country);
                if (newFilters.tourType.length)
                    params.set('tourType', newFilters.tourType.join(','));
                if (newFilters.suitableFor.length)
                    params.set('suitableFor', newFilters.suitableFor.join(','));
                if (newFilters.duration)
                    params.set('duration', newFilters.duration);
                if (newFilters.difficulty)
                    params.set('difficulty', newFilters.difficulty);
                if (newFilters.tourStyle)
                    params.set('tourStyle', newFilters.tourStyle);
                if (newFilters.currency)
                    params.set('currency', newFilters.currency);
                if (newFilters.mostPopular) params.set('mostPopular', 'true');
                if (newFilters.minPrice > 0)
                    params.set('minPrice', String(newFilters.minPrice));
                if (newFilters.maxPrice < 200000)
                    params.set('maxPrice', String(newFilters.maxPrice));
                if (newFilters.minRating > 0)
                    params.set('minRating', String(newFilters.minRating));

                const newUrl = `${
                    window.location.pathname
                }?${params.toString()}`;
                router.replace(newUrl, { scroll: false });
            }, 300);
        },
        [FILTER_PARAMS, router]
    );

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let count = 0;
        if (filters.country) count++;
        if (filters.tourType.length > 0) count++;
        if (filters.suitableFor.length > 0) count++;
        if (filters.duration) count++;
        if (filters.difficulty) count++;
        if (filters.tourStyle) count++;
        if (filters.currency) count++;
        if (filters.mostPopular) count++;
        if (filters.minPrice > 0) count++;
        if (filters.maxPrice < 200000) count++;
        if (filters.minRating > 0) count++;

        setActiveFiltersCount(count);
    }, [filters]);

    // Optimistic update functions - update state immediately without waiting for URL
    const updateFilter = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        updateSearchParams(newFilters);
    };

    const updateArrayFilter = (key, value, checked) => {
        const newFilters = {
            ...filters,
            [key]: checked
                ? [...filters[key], value]
                : filters[key].filter(item => item !== value),
        };
        setFilters(newFilters);
        updateSearchParams(newFilters);
    };

    const clearAllFilters = () => {
        const clearedFilters = {
            ...filters,
            country: '',
            tourType: [],
            suitableFor: [],
            duration: '',
            difficulty: '',
            tourStyle: '',
            currency: '',
            mostPopular: false,
            minPrice: 0,
            maxPrice: 200000,
            minRating: 0,
        };
        setFilters(clearedFilters);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        isUpdatingFromURL.current = true;

        const params = new URLSearchParams(window.location.search);
        FILTER_PARAMS.forEach(key => params.delete(key));

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.replace(newUrl, { scroll: false });
    };

    const formatPrice = price => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString()}`;
    };

    const displayedTourTypes = showAllTourTypes
        ? filterOptions.tourTypes
        : filterOptions.tourTypes.slice(0, 6);

    const displayedSuitableFor = showAllSuitableFor
        ? filterOptions.suitableFor
        : filterOptions.suitableFor.slice(0, 6);

    const displayedCurrency = showAllCurrencies
        ? filterOptions.currencies
        : filterOptions.currencies.slice(0, 6);
    const displayedTourStyles = showAllTourStyles
        ? filterOptions.tourStyles
        : filterOptions.tourStyles.slice(0, 6);

    return (
        <div className='lg:w-80'>
            <Card className='p-5 sticky top-24 overflow-visible shadow-md'>
                {/* Header */}
                <div className='flex items-center justify-between mb-5 pb-4 border-b border-border'>
                    <h3 className='text-lg font-bold text-foreground'>
                        Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={clearAllFilters}
                            className='text-primary hover:text-primary/80 hover:bg-primary/10'>
                            Clear all
                        </Button>
                    )}
                </div>

                {/* Tour Type - Chip Style */}
                <div className='mb-6'>
                    <h4 className='text-sm font-bold mb-3 text-foreground'>
                        Tour Type
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                        {displayedTourTypes.map((type, i) => (
                            <Badge
                                key={i}
                                variant={
                                    filters.tourType.includes(type?.name)
                                        ? 'default'
                                        : 'outline'
                                }
                                className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-all ${
                                    filters.tourType.includes(type?.name)
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-input'
                                }`}
                                onClick={() =>
                                    updateArrayFilter(
                                        'tourType',
                                        type?.name,
                                        !filters.tourType.includes(type?.name)
                                    )
                                }>
                                {type?.name}
                            </Badge>
                        ))}
                    </div>
                    {filterOptions.tourTypes.length > 6 && (
                        <Button
                            variant='link'
                            className='text-xs mt-2 p-0 h-auto text-primary hover:text-primary/80'
                            onClick={() =>
                                setShowAllTourTypes(!showAllTourTypes)
                            }>
                            {showAllTourTypes ? 'Show less' : 'Show more'}
                        </Button>
                    )}
                </div>

                {/* Suitable For - Badge Style */}
                <div className='mb-6'>
                    <h4 className='text-sm font-bold mb-3 text-foreground'>
                        Suitable For
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                        {displayedSuitableFor.map((item, i) => (
                            <Badge
                                key={i}
                                variant={
                                    filters.suitableFor.includes(item?.name)
                                        ? 'default'
                                        : 'outline'
                                }
                                className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-all ${
                                    filters.suitableFor.includes(item?.name)
                                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                        : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-input'
                                }`}
                                onClick={() =>
                                    updateArrayFilter(
                                        'suitableFor',
                                        item?.name,
                                        !filters.suitableFor.includes(
                                            item?.name
                                        )
                                    )
                                }>
                                {item?.name}
                            </Badge>
                        ))}
                    </div>
                    {filterOptions.suitableFor.length > 6 && (
                        <Button
                            variant='link'
                            className='text-xs mt-2 p-0 h-auto text-primary hover:text-primary/80'
                            onClick={() =>
                                setShowAllSuitableFor(!showAllSuitableFor)
                            }>
                            {showAllSuitableFor ? 'Show less' : 'Show more'}
                        </Button>
                    )}
                </div>

                {/* Difficulty - Radio Style */}
                <div className='mb-6'>
                    <h4 className='text-sm font-bold mb-3 text-foreground'>
                        Difficulty
                    </h4>
                    <div className='space-y-2'>
                        {filterOptions?.difficulties.map((diff, i) => (
                            <div key={i} className='flex items-center'>
                                <Input
                                    type='radio'
                                    id={`difficulty-${diff?.name}`}
                                    name='difficulty'
                                    checked={filters.difficulty === diff?.name}
                                    onChange={() =>
                                        updateFilter('difficulty', diff?.name)
                                    }
                                    className='w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer'
                                />
                                <label
                                    htmlFor={`difficulty-${diff?.name}`}
                                    className='ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors'>
                                    {diff?.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tour Style - Radio Style */}
                <div className='mb-6'>
                    <h4 className='text-sm font-bold mb-3 text-foreground'>
                        Tour Style
                    </h4>
                    <div className='space-y-2'>
                        <div className='flex items-center'>
                            <Input
                                type='radio'
                                id='tourStyle-any'
                                name='tourStyle'
                                checked={!filters.tourStyle}
                                onChange={() => updateFilter('tourStyle', '')}
                                className='w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer'
                            />
                            <label
                                htmlFor='tourStyle-any'
                                className='ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors'>
                                Any tour style
                            </label>
                        </div>
                        {displayedTourStyles.map((style, i) => (
                            <div key={i} className='flex items-center'>
                                <Input
                                    type='radio'
                                    id={`tourStyle-${style?.name}`}
                                    name='tourStyle'
                                    checked={filters.tourStyle === style?.name}
                                    onChange={() =>
                                        updateFilter('tourStyle', style?.name)
                                    }
                                    className='w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer'
                                />
                                <label
                                    htmlFor={`tourStyle-${style?.name}`}
                                    className='ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors'>
                                    {style?.name}
                                </label>
                            </div>
                        ))}
                        {filterOptions.tourStyles.length > 6 && (
                            <Button
                                variant='link'
                                className='text-xs mt-2 p-0 h-auto text-primary hover:text-primary/80'
                                onClick={() =>
                                    setShowAllTourStyles(!showAllTourStyles)
                                }>
                                {showAllTourStyles ? 'Show less' : 'Show more'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Currency - Radio Style */}
                <div className='mb-6'>
                    <h4 className='text-sm font-bold mb-3 text-foreground'>
                        Accepted Currency
                    </h4>
                    <div className='space-y-2'>
                        <div className='flex items-center'>
                            <Input
                                type='radio'
                                id='currency-any'
                                name='currency'
                                checked={!filters.currency}
                                onChange={() => updateFilter('currency', '')}
                                className='w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer'
                            />
                            <label
                                htmlFor='currency-any'
                                className='ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors'>
                                Any currency
                            </label>
                        </div>
                        {displayedCurrency.map((currency, i) => (
                            <div key={i} className='flex items-center'>
                                <Input
                                    type='radio'
                                    id={`currency-${currency?.name}`}
                                    name='currency'
                                    checked={
                                        filters.currency === currency?.name
                                    }
                                    onChange={() =>
                                        updateFilter('currency', currency?.name)
                                    }
                                    className='w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer'
                                />
                                <label
                                    htmlFor={`currency-${currency?.name}`}
                                    className='ml-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors'>
                                    {currency?.name}
                                </label>
                            </div>
                        ))}
                        {filterOptions.currencies.length > 6 && (
                            <Button
                                variant='link'
                                className='text-xs mt-2 p-0 h-auto text-primary hover:text-primary/80'
                                onClick={() =>
                                    setShowAllCurrencies(!showAllCurrencies)
                                }>
                                {showAllCurrencies ? 'Show less' : 'Show more'}
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AdvancedTripFilter;

