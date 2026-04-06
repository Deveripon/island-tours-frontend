/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useFormContext } from 'react-hook-form';

// Destination Field Component
import { getAllTrips } from '@/app/_actions/trips/affiliateTripsAction';
import { useCallback } from 'react';

export const TripSelectionField = ({ control }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const { watch } = useFormContext();

    // Watch the tripId field value
    const tripId = watch('tripId');

    // Memoize the fetch function to prevent unnecessary re-renders
    const fetchtrips = useCallback(async userId => {
        if (!userId) return;

        setLoading(true);
        try {
            const res = await getAllTrips(`createdById=${userId}&limit=100`);
            console.log(`res`, res);

            if (res?.success) {
                setTrips(res?.result?.data?.data || []);
            }
        } catch (error) {
            setTrips([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Only fetch data once when session is available
    useEffect(() => {
        if (session?.user?.id) {
            fetchtrips(session.user.id);
        }
    }, [session?.user?.id, fetchtrips]);

    return (
        <FormField
            control={control}
            name='tripId'
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Select Trip
                        <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                        <TripSelection
                            trips={trips}
                            defaultValues={Array.isArray(trips) ? trips.find(
                                trip => trip.id === tripId
                            ) : undefined}
                            onValueChange={field.onChange}
                            value={field.value}
                            loading={loading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

function TripSelection({ trips, onValueChange, loading, defaultValues }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValues?.id);

    useEffect(() => {
        if (defaultValues !== undefined && defaultValues !== value) {
            setValue(defaultValues.id);
        }
    }, [defaultValues]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className=' w-full h-10 justify-between'>
                    {loading ? (
                        <div className='flex gap-2'>
                            <Loader2 className='animate-spin' />
                            Fetching trips
                        </div>
                    ) : value ? (
                        Array.isArray(trips) && trips?.find(trip => trip.id === value)?.title
                    ) : (
                        'Select Trip...'
                    )}
                    <ChevronsUpDown className='opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 w-[400px] md:w-[480px] xl:w-[550px]'>
                <Command>
                    <CommandInput
                        placeholder='Search trip...'
                        className='h-9'
                    />
                    <CommandList>
                        {loading ? (
                            <div className='p-4 flex gap-2 justify-center items-center'>
                                <Loader2 className='animate-spin' />
                                Fetching trips
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No trip found.</CommandEmpty>
                                <CommandGroup>
                                    {Array.isArray(trips) && trips.map(trip => (
                                        <CommandItem
                                            className={
                                                value === trip.id &&
                                                ' bg-green-100 border-green-200 '
                                            }
                                            key={trip.id}
                                            value={trip.id}
                                            onSelect={currentValue => {
                                                setValue(
                                                    currentValue === value
                                                        ? ''
                                                        : currentValue
                                                );
                                                onValueChange(
                                                    currentValue === value
                                                        ? ''
                                                        : currentValue
                                                );
                                                setOpen(false);
                                            }}>
                                            {trip.title}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

