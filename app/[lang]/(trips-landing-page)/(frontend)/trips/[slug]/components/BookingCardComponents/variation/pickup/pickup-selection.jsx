'use client';

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
import { getCurrencyIcon } from '@/utils/currency-info';
import { ChevronDown, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

export function PickupSelectField({
    pickups = [],
    onValueChange,
    currency,
    value: externalValue,
    className = '' }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(externalValue || '');

    // Update internal value when external value changes
    useEffect(() => {
        if (externalValue !== undefined && externalValue !== value) {
            setValue(externalValue || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalValue]);

    const handleSelect = currentValue => {
        // If selecting the same value, deselect it (set to empty)
        const newValue = currentValue === value ? '' : currentValue;
        setValue(newValue);

        // Find the selected pickup object or null if deselecting
        const selectedPickup = newValue
            ? pickups.find(pickup => pickup.id === newValue)
            : null;

        // Call the parent's onValueChange with the pickup object (not just the ID)
        onValueChange(selectedPickup);
        setOpen(false);
    };

    const selectedPickup = pickups.find(pickup => pickup.id === value);

    // Don't render if no pickups available
    if (!pickups || pickups.length === 0) {
        return null;
    }

    return (
        <div className={className}>
            <h3 className='text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400'>
                Pickup Location (Optional)
            </h3>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        onClick={() => setOpen(!open)}
                        className='w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors flex items-center justify-between text-left'>
                        <div className='flex items-center gap-3 flex-1 min-w-0'>
                            <MapPin className='h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0' />
                            {selectedPickup ? (
                                <div className='flex-1 min-w-0'>
                                    <p className='text-sm font-light text-gray-900 dark:text-gray-200 truncate'>
                                        {selectedPickup.locationName}
                                    </p>
                                    <p className='text-sm font-light text-gray-500 dark:text-gray-400'>
                                        {getCurrencyIcon(currency)}
                                        {selectedPickup.price} per person
                                    </p>
                                </div>
                            ) : (
                                <span className='text-sm text-light text-gray-500 dark:text-gray-400'>
                                    Select pickup location...
                                </span>
                            )}
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 transition-transform ${
                                open ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent className='p-0 dark:bg-gray-900 dark:border-gray-800'>
                    <Command className='dark:bg-gray-900'>
                        <CommandInput
                            placeholder='Search pickup locations...'
                            className='h-9 dark:bg-gray-900 dark:text-gray-200 dark:placeholder:text-gray-500'
                        />
                        <CommandList className='dark:bg-gray-900'>
                            <CommandEmpty className='dark:text-gray-400'>
                                No pickup locations found.
                            </CommandEmpty>
                            <CommandGroup>
                                {/* No pickup option */}
                                <CommandItem
                                    className={
                                        value === ''
                                            ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                                            : 'cursor-pointer dark:hover:bg-gray-800 dark:text-gray-200'
                                    }
                                    onSelect={() => handleSelect('')}>
                                    <div className='flex flex-col w-full'>
                                        <span className='font-medium dark:text-gray-200'>
                                            No pickup required
                                        </span>
                                        <span className='text-sm text-gray-500 dark:text-gray-400'>
                                            I&apos;ll arrange my own transport
                                        </span>
                                    </div>
                                </CommandItem>

                                {/* Pickup options */}
                                {pickups.map(pickup => (
                                    <CommandItem
                                        className={
                                            value === pickup.id
                                                ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                                                : 'cursor-pointer dark:hover:bg-gray-800 dark:text-gray-200'
                                        }
                                        key={pickup.id}
                                        value={pickup.id}
                                        onSelect={() =>
                                            handleSelect(pickup.id)
                                        }>
                                        <div className='flex flex-col w-full'>
                                            <div className='flex justify-between items-start'>
                                                <span className='font-medium dark:text-gray-200'>
                                                    {pickup.locationName}
                                                </span>
                                                <span className='text-sm font-semibold text-green-600 dark:text-green-400'>
                                                    {getCurrencyIcon(currency)}
                                                    {pickup.price}/person
                                                </span>
                                            </div>
                                            {pickup.fullAddress && (
                                                <span className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                                                    {pickup.fullAddress}
                                                </span>
                                            )}
                                            {pickup.meetingInstruction && (
                                                <span className='text-sm text-blue-600 dark:text-blue-400 mt-1'>
                                                    📍{' '}
                                                    {pickup.meetingInstruction}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

