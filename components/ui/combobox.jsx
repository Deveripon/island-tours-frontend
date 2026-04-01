'use client';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';

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
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export function Combobox({
    options = [],
    value,
    onValueChange,
    placeholder = 'Select an option',
    searchPlaceholder = 'Search...',
    emptyMessage = 'No options found.',
    disabled = false,
    className,
    allowCustomValues = false,
    isLoading = false,
    onInputChange,
    defaultOptions = [] }) {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef(null);
    const triggerRef = useRef(null);

    // Ensure we initialize with a safe empty array if both options are empty or undefined
    const initialOptions =
        Array.isArray(defaultOptions) && defaultOptions.length > 0
            ? [...defaultOptions]
            : Array.isArray(options)
            ? [...options]
            : [];

    const [displayedOptions, setDisplayedOptions] = useState(initialOptions);

    // Load default options if they exist
    useEffect(() => {
        if (Array.isArray(defaultOptions) && defaultOptions.length > 0) {
            setDisplayedOptions([...defaultOptions]);
        }
    }, [defaultOptions]);

    // Update displayed options when options change
    useEffect(() => {
        if (Array.isArray(options) && options.length > 0) {
            setDisplayedOptions([...options]);
        }
    }, [options]);

    // Handle keyboard interaction with the trigger button
    useEffect(() => {
        const handleKeyDown = e => {
            if (disabled) return;

            // If the button is focused and user types, open the dropdown and focus input
            if (
                document.activeElement === triggerRef.current &&
                e.key.length === 1 &&
                /[a-zA-Z0-9]/.test(e.key)
            ) {
                setOpen(true);
                setSearchValue(e.key);
                setTimeout(() => {
                    if (inputRef.current) {
                        inputRef.current.focus();
                    }
                }, 0);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [disabled]);

    // Reset search when closed
    useEffect(() => {
        if (!open) {
            setSearchValue('');
        }
    }, [open]);

    // Handle input change with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onInputChange && searchValue) {
                onInputChange(searchValue);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchValue, onInputChange]);

    // Filter displayed options locally if we're not waiting for API
    useEffect(() => {
        try {
            if (!isLoading && searchValue) {
                // Start with default options if options is empty
                const baseOptions =
                    Array.isArray(options) && options.length > 0
                        ? options
                        : Array.isArray(defaultOptions) &&
                          defaultOptions.length > 0
                        ? defaultOptions
                        : [];

                // If we don't have options for filtering, try to use the current displayedOptions
                const optionsToFilter =
                    baseOptions.length > 0
                        ? baseOptions
                        : Array.isArray(displayedOptions)
                        ? displayedOptions
                        : [];

                // Safely filter options
                const filteredOptions = optionsToFilter.filter(
                    option =>
                        option &&
                        typeof option.label === 'string' &&
                        option.label
                            .toLowerCase()
                            .includes(searchValue.toLowerCase())
                );

                setDisplayedOptions(filteredOptions);
            } else if (Array.isArray(options) && options.length > 0) {
                setDisplayedOptions([...options]);
            }
        } catch (error) {
            // Fallback to empty array if there's an error during filtering
            setDisplayedOptions([]);
        }
    }, [searchValue, isLoading, options, defaultOptions, displayedOptions]);

    // Selected option object - safely find the option
    const selectedOption = value
        ? (Array.isArray(options) &&
              options.find(option => option && option.value === value)) ||
          (Array.isArray(defaultOptions) &&
              defaultOptions.find(option => option && option.value === value))
        : null;

    // Focus the search input when opened
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [open]);

    // Handle button click (open dropdown)
    const handleButtonClick = () => {
        if (!disabled) {
            setOpen(!open);
        }
    };

    // Safe array access for rendering
    const safeDisplayedOptions = Array.isArray(displayedOptions)
        ? displayedOptions
        : [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    disabled={disabled}
                    onClick={handleButtonClick}
                    className={cn(
                        'w-full justify-between font-normal',
                        !value && 'text-gray-700',
                        className
                    )}>
                    {selectedOption
                        ? selectedOption.label
                        : value || placeholder}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='p-0 w-full min-w-[200px]' align='start'>
                <Command shouldFilter={false}>
                    <div className='flex items-center border-b px-3'>
                        <CommandInput
                            ref={inputRef}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onValueChange={value => {
                                setSearchValue(value);
                            }}
                            className='h-9'
                        />
                    </div>
                    {isLoading ? (
                        <div className='py-6 text-center text-sm'>
                            Loading...
                        </div>
                    ) : (
                        <CommandList>
                            <CommandEmpty>
                                {emptyMessage}
                                {allowCustomValues && searchValue && (
                                    <Button
                                        variant='ghost'
                                        className='mt-2 w-full justify-start'
                                        onClick={() => {
                                            onValueChange(searchValue);
                                            setOpen(false);
                                        }}>
                                        <PlusCircle className='mr-2 h-4 w-4' />
                                        Add &quot;{searchValue}&quot;
                                    </Button>
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {safeDisplayedOptions
                                    .filter(
                                        option =>
                                            option &&
                                            typeof option.label === 'string' &&
                                            (!searchValue ||
                                                option.label
                                                    .toLowerCase()
                                                    .includes(
                                                        searchValue.toLowerCase()
                                                    ))
                                    )
                                    .map(option => (
                                        <CommandItem
                                            key={option.value}
                                            value={option.value}
                                            onSelect={() => {
                                                onValueChange(option.value);
                                                setOpen(false);
                                            }}>
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    value === option.value
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </CommandList>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}

