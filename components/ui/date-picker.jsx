import {
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Calendar01Icon,
    Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React, { useEffect, useState } from 'react';

// Utility function to merge class names
const cn = (...classes) => {
    return classes.filter(Boolean).join(' ');
};

// Button variants utility
const buttonVariants = ({ variant = 'default', size = 'default' }) => {
    const baseClasses =
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';

    const variants = {
        default: 'bg-primary text-white shadow hover:bg-primary/80',
        outline:
            'border border-gray-300 dark:border-gray-600 bg-background dark:bg-gray-900 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
    };

    const sizes = {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-sm',
        lg: 'h-10 rounded-md px-8',
    };

    return `${baseClasses} ${variants[variant]} ${sizes[size]}`;
};

// Button Component
const Button = React.forwardRef(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

// Enhanced weekday utilities
const WEEKDAY_NAMES = {
    sunday: 0,
    sun: 0,
    monday: 1,
    mon: 1,
    tuesday: 2,
    tue: 2,
    tues: 2,
    wednesday: 3,
    wed: 3,
    thursday: 4,
    thu: 4,
    thur: 4,
    thurs: 4,
    friday: 5,
    fri: 5,
    saturday: 6,
    sat: 6,
};

// Convert weekday names to day numbers (0 = Sunday, 1 = Monday, etc.)
const convertWeekdayNamesToNumbers = weekdayNames => {
    if (!Array.isArray(weekdayNames)) return [];

    return weekdayNames
        .map(name => {
            if (typeof name === 'number') return name;
            if (typeof name === 'string') {
                const normalized = name.toLowerCase().trim();
                return WEEKDAY_NAMES[normalized];
            }
            return null;
        })
        .filter(num => num !== null && num !== undefined);
};

// Convert date to ISO DateTime format (YYYY-MM-DDTHH:MM:SS.sssZ)
const formatDateToISO = date => {
    if (!date) return '';
    return date.toISOString();
};

// Convert date to ISO date format (YYYY-MM-DD) for display purposes
const formatDateToISODate = date => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Date formatting utility with multiple format options
const formatDate = (date, format = 'full') => {
    if (!date) return '';

    const formats = {
        full: {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
        long: {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        },
        short: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        },
        numeric: {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        },
        iso: null, // Special case for ISO format
        'month-day': {
            month: 'long',
            day: 'numeric',
        },
        'month-day-short': {
            month: 'short',
            day: 'numeric',
        },
        'day-month-year': {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        },
        custom: null, // For custom format strings
    };

    if (format === 'iso') {
        return formatDateToISODate(date);
    }

    if (typeof format === 'string' && formats[format]) {
        return date.toLocaleDateString('en-US', formats[format]);
    }

    // If format is an object with custom options, use it directly
    if (typeof format === 'object') {
        return date.toLocaleDateString('en-US', format);
    }

    // Default to full format
    return date.toLocaleDateString('en-US', formats.full);
};

// Parse ISO string (both date and datetime) to Date object
const parseDateFromISO = dateString => {
    if (!dateString) return null;
    let date;
    if (dateString.includes('T')) {
        date = new Date(dateString);
    } else {
        date = new Date(dateString + 'T00:00:00');
    }
    return isNaN(date.getTime()) ? null : date;
};

// Enhanced date disabled check with weekday name support
const isDateDisabled = (date, options = {}) => {
    const {
        disablePastDates = false,
        disableFutureDates = false,
        disabledDates = [],
        disabledDaysOfWeek = [],
        enabledDaysOfWeek = null,
        minDate = null,
        maxDate = null,
        enabledDatesOnly = null,
        customDisabledCheck = null,
    } = options;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (disablePastDates && checkDate < today) {
        return true;
    }

    if (disableFutureDates && checkDate > today) {
        return true;
    }

    if (minDate) {
        const min = new Date(minDate);
        min.setHours(0, 0, 0, 0);
        if (checkDate < min) return true;
    }

    if (maxDate) {
        const max = new Date(maxDate);
        max.setHours(0, 0, 0, 0);
        if (checkDate > max) return true;
    }

    if (enabledDatesOnly && Array.isArray(enabledDatesOnly)) {
        const enabledDateStrings = enabledDatesOnly.map(d =>
            typeof d === 'string' ? d : formatDateToISODate(d)
        );
        const currentDateString = formatDateToISODate(checkDate);
        if (!enabledDateStrings.includes(currentDateString)) {
            return true;
        }
    }

    if (disabledDates && Array.isArray(disabledDates)) {
        const disabledDateStrings = disabledDates.map(d =>
            typeof d === 'string' ? d : formatDateToISODate(d)
        );
        const currentDateString = formatDateToISODate(checkDate);
        if (disabledDateStrings.includes(currentDateString)) {
            return true;
        }
    }

    const dayOfWeek = checkDate.getDay();

    if (enabledDaysOfWeek && Array.isArray(enabledDaysOfWeek)) {
        const enabledDayNumbers =
            convertWeekdayNamesToNumbers(enabledDaysOfWeek);
        if (
            enabledDayNumbers.length > 0 &&
            !enabledDayNumbers.includes(dayOfWeek)
        ) {
            return true;
        }
    }

    if (disabledDaysOfWeek && Array.isArray(disabledDaysOfWeek)) {
        const disabledDayNumbers =
            convertWeekdayNamesToNumbers(disabledDaysOfWeek);
        if (disabledDayNumbers.includes(dayOfWeek)) {
            return true;
        }
    }

    if (customDisabledCheck && typeof customDisabledCheck === 'function') {
        if (customDisabledCheck(checkDate)) {
            return true;
        }
    }

    return false;
};

// Calendar Component
function CustomCalendar({
    mode = 'single',
    selected,
    onSelect,
    className = '',
    showOutsideDays = true,
    dateRestrictions = {} }) {
    const [currentMonth, setCurrentMonth] = useState(() => {
        return selected ? selected.getMonth() : new Date().getMonth();
    });
    const [currentYear, setCurrentYear] = useState(() => {
        return selected ? selected.getFullYear() : new Date().getFullYear();
    });

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        if (showOutsideDays) {
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

            for (let i = firstDay - 1; i >= 0; i--) {
                const date = new Date(prevYear, prevMonth, daysInPrevMonth - i);
                days.push({
                    day: daysInPrevMonth - i,
                    isCurrentMonth: false,
                    date: date,
                    isDisabled: isDateDisabled(date, dateRestrictions) });
            }
        } else {
            for (let i = 0; i < firstDay; i++) {
                days.push({ day: '', isEmpty: true });
            }
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            days.push({
                day,
                isCurrentMonth: true,
                date: date,
                isDisabled: isDateDisabled(date, dateRestrictions) });
        }

        if (showOutsideDays) {
            const totalCells = 42;
            const remainingCells = totalCells - days.length;
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextYear =
                currentMonth === 11 ? currentYear + 1 : currentYear;

            for (
                let day = 1;
                day <= remainingCells && days.length < 42;
                day++
            ) {
                const date = new Date(nextYear, nextMonth, day);
                days.push({
                    day,
                    isCurrentMonth: false,
                    date: date,
                    isDisabled: isDateDisabled(date, dateRestrictions) });
            }
        }

        return days;
    };

    const navigateMonth = direction => {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const isToday = date => {
        if (!date) return false;
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSelected = date => {
        if (!date || !selected) return false;
        return date.toDateString() === selected.toDateString();
    };

    const handleDateClick = dayInfo => {
        if (dayInfo.isEmpty || dayInfo.isDisabled) return;
        if (onSelect) {
            onSelect(dayInfo.date);
        }
    };

    return (
        <div className={cn('p-3', className)}>
            <div className='flex justify-center pt-1 relative items-center w-full mb-4'>
                <button
                    type='button'
                    onClick={() => navigateMonth('prev')}
                    className='absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <HugeiconsIcon
                        icon={ArrowLeft01Icon}
                        className='h-4 w-4 dark:text-gray-300'
                    />
                </button>

                <div className='text-sm font-medium dark:text-gray-200'>
                    {months[currentMonth]} {currentYear}
                </div>

                <button
                    type='button'
                    onClick={() => navigateMonth('next')}
                    className='absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'>
                    <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className='h-4 w-4 dark:text-gray-300'
                    />
                </button>
            </div>

            <div className='flex'>
                {daysOfWeek.map(day => (
                    <div
                        key={day}
                        className='text-gray-500 dark:text-gray-400 rounded-md w-8 font-normal text-sm text-center py-2'>
                        {day}
                    </div>
                ))}
            </div>

            <div className='w-full border-collapse space-x-1'>
                {Array.from(
                    { length: Math.ceil(generateCalendarDays().length / 7) },
                    (_, weekIndex) => (
                        <div key={weekIndex} className='flex w-full mt-2'>
                            {generateCalendarDays()
                                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                                .map((dayInfo, dayIndex) => {
                                    if (dayInfo.isEmpty) {
                                        return (
                                            <div
                                                key={dayIndex}
                                                className='h-8 w-8 p-0'
                                            />
                                        );
                                    }

                                    const {
                                        day,
                                        isCurrentMonth,
                                        date,
                                        isDisabled,
                                    } = dayInfo;

                                    return (
                                        <button
                                            key={dayIndex}
                                            type='button'
                                            onClick={() =>
                                                handleDateClick(dayInfo)
                                            }
                                            disabled={isDisabled}
                                            className={cn(
                                                'h-8 w-8 p-0 font-normal text-sm rounded-md transition-colors',
                                                'hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100',
                                                isCurrentMonth
                                                    ? 'text-gray-900 dark:text-gray-100'
                                                    : 'text-gray-400 dark:text-gray-500',
                                                isSelected(date)
                                                    ? 'bg-primary text-white hover:bg-primary/80'
                                                    : '',
                                                isToday(date) &&
                                                    !isSelected(date)
                                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                    : '',
                                                isDisabled
                                                    ? 'opacity-25 cursor-not-allowed text-gray-300 dark:text-gray-600 hover:bg-transparent hover:text-gray-300 dark:hover:text-gray-600'
                                                    : ''
                                            )}>
                                            {day}
                                        </button>
                                    );
                                })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

// Enhanced DatePicker Component with dark mode support and dateFormat
export const FormDatePicker = React.forwardRef(
    (
        {
            className,
            hideIcon = false,
            showClearButton = true,
            placeholder = 'Pick a date',
            value,
            onChange,
            onBlur,
            onClear,
            iconClass,
            name,
            disabled = false,
            disablePastDates = false,
            disableFutureDates = false,
            disabledDates = [],
            disabledDaysOfWeek = [],
            enabledDaysOfWeek = null,
            minDate = null,
            maxDate = null,
            enabledDatesOnly = null,
            customDisabledCheck = null,
            dateFormat = 'full',
            ...props
        },
        ref
    ) => {
        const [date, setDate] = useState(parseDateFromISO(value));
        const [isOpen, setIsOpen] = useState(false);

        const dateRestrictions = {
            disablePastDates,
            disableFutureDates,
            disabledDates,
            disabledDaysOfWeek,
            enabledDaysOfWeek,
            minDate,
            maxDate,
            enabledDatesOnly,
            customDisabledCheck,
        };

        useEffect(() => {
            setDate(parseDateFromISO(value));
        }, [value]);

        const handleDateSelect = selectedDate => {
            if (isDateDisabled(selectedDate, dateRestrictions)) {
                return;
            }

            setDate(selectedDate);
            setIsOpen(false);

            if (onChange) {
                const isoDate = formatDateToISO(selectedDate);
                onChange(isoDate);
            }
        };

        const handleClear = e => {
            e.stopPropagation();
            setDate(null);

            if (onChange) {
                onChange('');
            }

            if (onClear) {
                onClear();
            }
        };

        const handleButtonClick = () => {
            if (!disabled) {
                setIsOpen(!isOpen);
            }
        };

        const handleBlur = () => {
            if (onBlur) {
                onBlur();
            }
        };

        return (
            <div className='relative'>
                <div
                    className={cn(
                        'flex items-center w-full h-[40px] px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-background dark:bg-gray-900 shadow-sm transition-colors',
                        'hover:bg-gray-50 dark:hover:bg-gray-700 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',
                        className,
                        !date && 'text-gray-500 dark:text-gray-400',
                        disabled &&
                            'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900'
                    )}>
                    <div
                        className='flex items-center flex-1 cursor-pointer dark:text-gray-100'
                        onClick={handleButtonClick}
                        role='button'
                        tabIndex={disabled ? -1 : 0}
                        onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleButtonClick();
                            }
                        }}>
                        {!hideIcon && (
                            <HugeiconsIcon
                                icon={Calendar01Icon}
                                className={cn('mr-2 h-4 w-4', iconClass)}
                            />
                        )}
                        {date ? (
                            formatDate(date, dateFormat)
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </div>

                    {showClearButton && date && !disabled && (
                        <button
                            type='button'
                            onClick={handleClear}
                            className='flex items-center justify-center w-6 h-6 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-sm transition-colors'
                            tabIndex={-1}
                            aria-label='Clear date'>
                            <HugeiconsIcon
                                icon={Cancel01Icon}
                                className='h-3 w-3 text-gray-500 dark:text-gray-400'
                            />
                        </button>
                    )}
                </div>

                <input
                    type='hidden'
                    name={name}
                    value={value || ''}
                    readOnly
                    ref={ref}
                    onBlur={handleBlur}
                    {...props}
                />

                {isOpen && !disabled && (
                    <>
                        <div
                            className='fixed inset-0 z-40'
                            onClick={() => setIsOpen(false)}
                        />
                        <div className='absolute top-full left-0 z-50 mt-1'>
                            <div className='rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-0 text-gray-900 dark:text-gray-100 shadow-lg'>
                                <CustomCalendar
                                    mode='single'
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    dateRestrictions={dateRestrictions}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }
);

FormDatePicker.displayName = 'FormDatePicker';

// Enhanced DatePickerWithPopover component with dark mode support and dateFormat
export function DatePickerWithPopover({
    className,
    hideIcon = false,
    showClearButton = true,
    placeholder = 'Pick a date',
    value,
    onChange,
    onClear,
    iconClass,
    disablePastDates = false,
    disableFutureDates = false,
    disabledDates = [],
    disabledDaysOfWeek = [],
    enabledDaysOfWeek = null,
    minDate = null,
    maxDate = null,
    enabledDatesOnly = null,
    customDisabledCheck = null,
    dateFormat = 'full' }) {
    const [date, setDate] = useState(value);
    const [isOpen, setIsOpen] = useState(false);

    const dateRestrictions = {
        disablePastDates,
        disableFutureDates,
        disabledDates,
        disabledDaysOfWeek,
        enabledDaysOfWeek,
        minDate,
        maxDate,
        enabledDatesOnly,
        customDisabledCheck,
    };

    const handleDateSelect = selectedDate => {
        if (isDateDisabled(selectedDate, dateRestrictions)) {
            return;
        }

        setDate(selectedDate);
        setIsOpen(false);
        if (onChange) {
            const isoDateTime = formatDateToISO(selectedDate);
            onChange(isoDateTime);
        }
    };

    const handleClear = e => {
        e.stopPropagation();
        setDate(null);

        if (onChange) {
            onChange('');
        }

        if (onClear) {
            onClear();
        }
    };

    return (
        <div className='relative'>
            <div
                className={cn(
                    'flex items-center w-[280px] h-10 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 shadow-sm transition-colors',
                    'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer dark:text-gray-100',
                    className,
                    !date && 'text-gray-500 dark:text-gray-400'
                )}
                onClick={() => setIsOpen(!isOpen)}
                role='button'
                tabIndex={0}
                onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}>
                <div className='flex items-center flex-1'>
                    {!hideIcon && (
                        <HugeiconsIcon
                            icon={Calendar01Icon}
                            className={cn('mr-2 h-4 w-4', iconClass)}
                        />
                    )}
                    {date ? (
                        formatDate(date, dateFormat)
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </div>

                {showClearButton && date && (
                    <button
                        type='button'
                        onClick={handleClear}
                        className='flex items-center justify-center w-6 h-6 ml-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-sm transition-colors'
                        tabIndex={-1}
                        aria-label='Clear date'>
                        <HugeiconsIcon
                            icon={Cancel01Icon}
                            className='h-3 w-3 text-gray-500 dark:text-gray-400'
                        />
                    </button>
                )}
            </div>

            {isOpen && (
                <>
                    <div
                        className='fixed inset-0 z-40'
                        onClick={() => setIsOpen(false)}
                    />
                    <div className='absolute top-full left-0 z-50 mt-1'>
                        <div className='rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-0 text-gray-900 dark:text-gray-100 shadow-lg'>
                            <CustomCalendar
                                mode='single'
                                selected={date}
                                onSelect={handleDateSelect}
                                dateRestrictions={dateRestrictions}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

