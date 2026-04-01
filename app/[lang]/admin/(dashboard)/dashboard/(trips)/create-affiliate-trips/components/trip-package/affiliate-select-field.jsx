'use client';

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
import { ChevronsUpDown, Loader2, Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function TourOperatorSelectField({
    tourOperators,
    onValueChange,
    loading,
    value: externalValue }) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(externalValue || '');
    const params = useParams();

    // Update internal value when external value changes
    useEffect(() => {
        if (externalValue !== undefined && externalValue !== value) {
            setValue(externalValue || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalValue]);

    const handleSelect = currentValue => {
        const newValue = currentValue === value ? '' : currentValue;
        setValue(newValue);
        onValueChange(newValue);
        setOpen(false);
    };

    const selectedtourOperator = tourOperators.find(
        tourOperator => tourOperator.id === value
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className='w-full h-10 justify-between'>
                    {loading ? (
                        <div className='flex gap-2 items-center'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Fetching Tour Partners
                        </div>
                    ) : selectedtourOperator ? (
                        selectedtourOperator.name
                    ) : (
                        'Select Tour Partner...'
                    )}
                    <ChevronsUpDown className='h-4 w-4 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 w-[400px] md:w-[480px] xl:w-[550px]'>
                <Command>
                    <CommandInput
                        placeholder='Search Tour Partners...'
                        className='h-9'
                    />
                    <CommandList>
                        {loading ? (
                            <div className='p-4 flex gap-2 justify-center items-center'>
                                <Loader2 className='h-4 w-4 animate-spin' />
                                Fetching Tour Partners
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>
                                    <div className='flex flex-col items-center justify-center py-2 px-4 text-center'>
                                        <div className='flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-4'>
                                            <Users className='h-8 w-8 text-orange-400' />
                                        </div>
                                        <h3 className='text-sm font-medium text-gray-900 mb-2'>
                                            No tour operators found
                                        </h3>
                                        <p className='text-sm text-gray-500 mb-4 max-w-sm'>
                                            We couldn&apos;t find any tour
                                            operators. Try to add a new tour
                                            operator.
                                        </p>
                                        <Link
                                            href={`/${params.tenant}/dashboard/tour-operators?create=true`}
                                            className='inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
                                            <Plus className='h-4 w-4' />
                                            Add Tour Partner
                                        </Link>
                                    </div>
                                </CommandEmpty>
                                <CommandGroup>
                                    {tourOperators.map(tourOperator => (
                                        <CommandItem
                                            className={
                                                value === tourOperator.id
                                                    ? 'bg-green-100 border-green-200'
                                                    : ''
                                            }
                                            key={tourOperator.id}
                                            value={tourOperator.id}
                                            onSelect={() =>
                                                handleSelect(tourOperator.id)
                                            }>
                                            {tourOperator.name}
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

