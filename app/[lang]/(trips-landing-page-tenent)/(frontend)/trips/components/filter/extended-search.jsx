'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import DestinationSearch from '../../../../components/home/destination-search';
import { FormDatePicker } from '../../../../components/ui/date-picker';
import GuestSelecetionPopup from '../../../../components/ui/guest-selection-popup';

const ExtendedSearch = ({ tenantId, destinations }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const debounceTimerRef = useRef(null);

    const [destination, setDestination] = useState(
        searchParams.get('destination') || ''
    );
    const [startDate, setStartDate] = useState(
        searchParams.get('startDate') || null
    );
    const [guests, setGuests] = useState({
        adults: parseInt(searchParams.get('adults') || '1', 10),
        children: parseInt(searchParams.get('children') || '0', 10),
        infants: parseInt(searchParams.get('infants') || '0', 10),
    });

    // Sync state with URL changes (including when URL has no params)
    useEffect(() => {
        const urlDestination = searchParams.get('destination') || '';
        const urlStartDate = searchParams.get('startDate') || null;
        const urlGuests = {
            adults: parseInt(searchParams.get('adults') || '1', 10),
            children: parseInt(searchParams.get('children') || '0', 10),
            infants: parseInt(searchParams.get('infants') || '0', 10),
        };

        // Update state only if URL values differ from current state
        if (destination !== urlDestination) {
            setDestination(urlDestination);
        }
        if (startDate !== urlStartDate) {
            setStartDate(urlStartDate);
        }
        if (
            guests.adults !== urlGuests.adults ||
            guests.children !== urlGuests.children ||
            guests.infants !== urlGuests.infants
        ) {
            setGuests(urlGuests);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]); // Remove state dependencies to avoid loops

    //  Preserve existing parameters when updating
    const updateSearchParams = useCallback(
        newParams => {
            // Start with current URL parameters
            const currentParams = new URLSearchParams(window.location.search);

            // Update only the parameters managed by this component
            Object.entries(newParams).forEach(([key, value]) => {
                if (
                    value &&
                    value !== '' &&
                    value !== null &&
                    value !== undefined
                ) {
                    currentParams.set(key, value);
                } else {
                    currentParams.delete(key);
                }
            });

            // Update URL while preserving other parameters
            const newUrl = `${
                window.location.pathname
            }?${currentParams.toString()}`;
            router.replace(newUrl, {
                scroll: false,
            });
        },
        [router]
    );

    const createParamsObject = useCallback(() => {
        const params = {};

        //  Always include destination (even if empty) so it can be properly deleted
        params.destination = destination.trim();

        //  Always include guest parameters so they can be properly deleted when reset
        params.adults =
            guests?.adults && guests.adults !== 1
                ? guests.adults.toString()
                : '';
        params.children =
            guests?.children && guests.children > 0
                ? guests.children.toString()
                : '';
        params.infants =
            guests?.infants && guests.infants > 0
                ? guests.infants.toString()
                : '';

        //  Always include startDate so it can be properly deleted when cleared
        if (startDate && startDate !== null) {
            const dateString =
                startDate instanceof Date
                    ? startDate.toISOString().split('T')[0]
                    : startDate;
            params.startDate = dateString;
        } else {
            params.startDate = '';
        }

        return params;
    }, [destination, guests, startDate]);

    // Update URL with debounce
    const debouncedUpdateSearchParams = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const params = createParamsObject();
            updateSearchParams(params);
        }, 500);
    }, [createParamsObject, updateSearchParams]);

    useEffect(() => {
        debouncedUpdateSearchParams();
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [destination, startDate, guests, debouncedUpdateSearchParams]);

    const handleDestinationChange = e => {
        setDestination(e.target.value);
    };

    const handleDateChange = value => {
        setStartDate(value);
    };

    const handleGuestsChange = newGuests => {
        setGuests(newGuests);
    };

    const handleSearch = () => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        const currentParams = new URLSearchParams(window.location.search);
        const newParams = createParamsObject();

        Object.entries(newParams).forEach(([key, value]) => {
            if (
                value &&
                value !== '' &&
                value !== null &&
                value !== undefined
            ) {
                currentParams.set(key, value);
            } else {
                currentParams.delete(key);
            }
        });

        router.push(`/site/${tenantId}/trips?${currentParams.toString()}`, {
            scroll: false,
        });
    };

    return (
        <Card className='mb-8 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <DestinationSearch
                    availableDestinations={destinations}
                    destination={destination}
                    setDestination={setDestination}
                    content='Where to?'
                    className='!border-gray-300 !bg-transparent dark:!border-gray-600  dark:text-gray-100 shadow'
                />

                <FormDatePicker
                    disablePastDates={true}
                    value={startDate}
                    onChange={handleDateChange}
                    dateFormat='short'
                    placeholder='Start date'
                    className='col-span-2 !h-10 !bg-transparent text-gray-600 dark:text-gray-300 !border-gray-300 dark:!border-gray-600 placeholder:text-gray-600 dark:placeholder:text-gray-400 border'
                />

                <GuestSelecetionPopup
                    guests={guests}
                    setGuests={handleGuestsChange}
                    className='!bg-transparent !border-gray-300 dark:!border-gray-600 !text-gray-700 dark:!text-gray-100'
                />
                <Button
                    onClick={handleSearch}
                    className='bg-primary hover:bg-primary/80 dark:bg-primary dark:hover:bg-primary/90 h-10'>
                    <Search className='mr-2 h-4 w-4' />
                    Search
                </Button>
            </div>
        </Card>
    );
};

export default ExtendedSearch;

