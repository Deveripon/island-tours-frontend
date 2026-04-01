import { clsx } from 'clsx';
import {
    addDays,
    differenceInDays,
    format,
    formatISO,
    isValid,
    parseISO,
} from 'date-fns';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly slug from a string
 * Converts to lowercase, removes special chars, replaces spaces with hyphens
 */
export function generateSlug(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Retrieve error messages as an array from error object
 * Recursively extracts error messages from nested fields
 */
export function getErrorMessages(errors) {
    const result = [];

    const extractErrors = (obj, parentPath = '') => {
        for (const key in obj) {
            const error = obj[key];
            const currentPath = parentPath ? `${parentPath}.${key}` : key;

            // If it has a message property and it's a string, add it
            if (error?.message && typeof error.message === 'string') {
                result.push(error.message);
            }

            // If nested errors in root object
            if (error?.root?.errors && typeof error.root.errors === 'object') {
                extractErrors(error.root.errors, currentPath);
            }

            // Check for nested objects with errors
            if (error && typeof error === 'object') {
                // If it has nested fields property
                if (error.fields && typeof error.fields === 'object') {
                    extractErrors(error.fields, currentPath);
                }

                // Handle array errors directly
                if (Array.isArray(error)) {
                    error.forEach((item, index) => {
                        if (item && typeof item === 'object') {
                            extractErrors(item, `${currentPath}[${index}]`);
                        }
                    });
                } else if (!error.message) {
                    // Process other object properties if they don't have a message (could be nested errors)
                    extractErrors(error, currentPath);
                }
            }
        }
    };

    extractErrors(errors);
    return result;
}

/**
 * Get Group of Categories
 */

export function getGroupedDataOfCategories(data) {
    const grouped = {};

    data &&
        data.length > 0 &&
        data.forEach(item => {
            item?.types?.forEach(type => {
                const key = String(type);
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(item);
            });
        });

    return grouped;
}

export function getGroupedDataOfStatus(data) {
    if (!Array.isArray(data)) {
        return {};
    }

    return data.reduce((groups, item) => {
        const status = item.status;
        if (!groups[status]) {
            groups[status] = [];
        }
        groups[status].push(item);
        return groups;
    }, {});
}

/**
 * Formate Category Keys
 */

export function formatKey(key) {
    return key
        .toLowerCase() // "suitable_for"
        .split('_') // ["suitable", "for"]
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // ["Suitable", "For"]
        .join(' '); // "Suitable For"
}

// Formate  to Capitilize
export function formateToCapitalize(text) {
    const converted = text &&
        text
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    return converted;
}

// Helper functions for file persistence (put these in a separate utils file)
export const fileToBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
            resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
                data: reader.result,
            });
        reader.onerror = error => reject(error);
    });
};

export const base64ToFile = base64Data => {
    const { name, type, size, lastModified, data } = base64Data;
    const byteCharacters = atob(data.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new File([byteArray], name, {
        type: type,
        lastModified: lastModified,
    });
    return file;
};

export const formatPrice = (price, currency = 'USD') => {
    if (price) return `${price} ${currency}`;
    if (!price) return `Included`;
};

/**
 * Get offset date with day count from an ISO date string
 * @param {string} isoDateString - The ISO date string (e.g., "2024-07-27T00:00:00.000Z")
 * @param {number} offsetDays - Number of days to offset (default: 30)
 * @returns {Object} Object containing offset date and day count
 */
export function getOffsetDate(isoDateString, offsetDays = 30) {
    try {
        // Parse the ISO date string
        const inputDate = parseISO(isoDateString);

        // Validate the parsed date
        if (!isValid(inputDate)) {
            throw new Error('Invalid ISO date string provided');
        }

        // Calculate offset date
        const offsetDate = addDays(inputDate, offsetDays);

        // Get current date for comparison
        const currentDate = new Date();

        // Calculate day count from current date to offset date
        const dayCount = differenceInDays(offsetDate, currentDate);

        // Calculate day count from input date to offset date
        const dayCountFromInput = differenceInDays(offsetDate, inputDate);

        return {
            inputDate: inputDate,
            offsetDate: offsetDate,
            inputDateISO: formatISO(inputDate),
            offsetDateISO: formatISO(offsetDate),
            dayCount: dayCount, // Days from now to offset date
            dayCountFromInput: dayCountFromInput, // Days from input to offset date
            isInPast: dayCount < 0,
            isToday: dayCount === 0,
            isFuture: dayCount > 0,
        };
    } catch (error) {
        throw new Error(`Error processing date: ${error.message}`);
    }
}

/**
 * Get trial expiration info with various offset calculations
 * @param {string} trialStartISO - Trial start date as ISO string
 * @param {number} trialDurationDays - Trial duration in days (default: 30)
 * @returns {Object} Comprehensive trial date information
 */
export function getTrialExpirationInfo(trialStartISO, trialDurationDays = 30) {
    try {
        const startDate = parseISO(trialStartISO);

        if (!isValid(startDate)) {
            throw new Error('Invalid trial start date');
        }

        const currentDate = new Date();
        const expirationDate = addDays(startDate, trialDurationDays);

        // Calculate various day counts
        const daysFromStart = differenceInDays(currentDate, startDate);
        const daysUntilExpiration = differenceInDays(
            expirationDate,
            currentDate
        );
        const totalTrialDays = differenceInDays(expirationDate, startDate);

        // Determine trial status
        let status = 'active';
        if (daysUntilExpiration < 0) {
            status = 'expired';
        } else if (daysUntilExpiration <= 7) {
            status = 'warning';
        } else if (daysUntilExpiration < 0 && daysUntilExpiration >= -7) {
            status = 'grace';
        }

        return {
            startDate: startDate,
            expirationDate: expirationDate,
            currentDate: currentDate,
            startDateISO: formatISO(startDate),
            expirationDateISO: formatISO(expirationDate),
            currentDateISO: formatISO(currentDate),
            daysFromStart: daysFromStart,
            daysUntilExpiration: daysUntilExpiration,
            totalTrialDays: totalTrialDays,
            daysUsed: Math.max(0, daysFromStart),
            daysRemaining: Math.max(0, daysUntilExpiration),
            progressPercentage: Math.min(
                100,
                Math.max(0, (daysFromStart / totalTrialDays) * 100)
            ),
            status: status,
            isExpired: daysUntilExpiration < 0,
            isExpiringSoon:
                daysUntilExpiration <= 7 && daysUntilExpiration >= 0,
            isActive: daysUntilExpiration > 0,
        };
    } catch (error) {
        throw new Error(`Error calculating trial info: ${error.message}`);
    }
}

// Example usage and tests
export function exampleUsage() {
    // Example 1: Basic 30-day offset
    const isoDate1 = '2024-07-27T00:00:00.000Z';
    const result1 = getOffsetDate(isoDate1);

    // Example 2: Custom offset (14 days)
    const result2 = getOffsetDate(isoDate1, 14);

    // Example 3: Trial expiration info
    const trialStart = '2024-07-01T00:00:00.000Z';
    const trialInfo = getTrialExpirationInfo(trialStart, 30);

    // Example 4: Different trial durations
    const trialInfo7Days = getTrialExpirationInfo(trialStart, 7);

    return {
        basicOffset: result1,
        customOffset: result2,
        trialInfo: trialInfo,
        shortTrial: trialInfo7Days,
    };
}

// Helper function to format dates for display
export function formatDateForDisplay(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
    };

    return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
}

// Quick utility for common use cases
export const dateUtils = {
    // Get 30 days from now
    get30DaysFromNow: () => getOffsetDate(formatISO(new Date()), 30),

    // Get days until a specific ISO date
    getDaysUntil: isoDate => {
        const targetDate = parseISO(isoDate);
        return differenceInDays(targetDate, new Date());
    },

    // Check if trial is expiring soon (within 7 days)
    isExpiringSoon: expirationISO => {
        const days = dateUtils.getDaysUntil(expirationISO);
        return days <= 7 && days >= 0;
    },

    // Check if trial is expired
    isExpired: expirationISO => {
        return dateUtils.getDaysUntil(expirationISO) < 0;
    },
};

export const formatFileSize = bytes => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// Date formatting utility
export const DateFormatStyles = {
    short: 'M/d/yy', // 7/2/25
    medium: 'MMM d, yyyy', // Jul 2, 2025
    long: 'EEEE, MMMM d, yyyy', // Wednesday, July 2, 2025
    iso: 'yyyy-MM-dd', // 2025-07-02
    isoDateTime: "yyyy-MM-dd'T'HH:mm:ss'Z'", // 2025-07-02T00:00:00Z
    custom: 'EEE, MMM d, yyyy', // Wed, Jul 2, 2025
    full: 'EEEE, MMMM d, yyyy', // Wednesday, July 2, 2025
    numeric: 'MM/dd/yyyy', // 07/02/2025
    compact: 'MMdd', // 0702
    year: 'yyyy', // 2025
    month: 'MMM', // Jul
    day: 'd', // 2
    dayName: 'EEEE', // Wednesday
    shortDay: 'EEE', // Wed
    fullMonth: 'MMMM', // July
    monthYear: 'MMM yyyy', // Jul 2025
    dayMonth: 'd MMM', // 2 Jul
    time: 'HH:mm', // 00:00 (if time available)
    dateTime: 'MMM d, yyyy HH:mm', // Jul 2, 2025 00:00
    relative: 'MMM d', // Jul 2
    us: 'M/d/yyyy', // 7/2/2025
    uk: 'd/M/yyyy', // 2/7/2025
    monthDay: 'MMMM d', // July 2
    shortYear: 'yy', // 25
    quarter: 'QQQ yyyy', // Q3 2025
};

function formatDateWithOffset(
    date,
    style,
    dayCount,
    after = false,
    previous = false
) {
    // Validate inputs
    if (!date || !dayCount || dayCount < 0) {
        return 'Invalid input';
    }

    // Parse the date if it's a string
    let baseDate;
    if (typeof date === 'string') {
        baseDate = parseISO(date);
    } else if (date instanceof Date) {
        baseDate = date;
    } else {
        return 'Invalid date format';
    }

    // Check if the parsed date is valid
    if (!isValid(baseDate)) {
        return 'Invalid date';
    }

    // Calculate the target date based on flags
    let targetDate;
    if (after) {
        targetDate = addDays(baseDate, dayCount);
    } else if (previous) {
        targetDate = subDays(baseDate, dayCount);
    } else {
        // Default to after if neither flag is specified
        targetDate = addDays(baseDate, dayCount);
    }

    // Get the format pattern
    const formatPattern = DateFormatStyles[style] || DateFormatStyles.medium;

    // Return formatted date
    return format(targetDate, formatPattern);
}

// Simple date formatter function
const formateDate = (date, style) => {
    const parsed = parseISO(date || new Date().toISOString());
    const formatPattern = DateFormatStyles[style] || DateFormatStyles.medium;
    return format(parsed, formatPattern || 'MMM d, yyyy');
};

export { formatDateWithOffset, formateDate };

