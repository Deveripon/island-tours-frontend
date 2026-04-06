import { addDays, format, isValid, parseISO, subDays } from 'date-fns';
export const generateUniqueUserId = () => {
    // Try to get existing ID from sessionStorage first
    if (typeof window !== 'undefined') {
        let userId = sessionStorage.getItem('tripBookingUserId');

        if (!userId) {
            // Generate a truly unique ID combining multiple factors
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const browserFingerprint = navigator.userAgent
                .slice(-10)
                .replace(/\W/g, '');
            const sessionRandom = Math.random().toString(36).substring(2, 9);

            userId = `user_${timestamp}_${random}_${browserFingerprint}_${sessionRandom}`;

            // Store in sessionStorage so it persists for the browser session
            sessionStorage.setItem('tripBookingUserId', userId);
        }

        return userId;
    }

    // Fallback for SSR
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
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
export function calculateAge(dateOfBirth) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const currentDay = today.getDate();

    // Extract birth date components
    const birthYear = dateOfBirth.year;
    const birthMonth = dateOfBirth.month;
    const birthDay = dateOfBirth.day;

    // Calculate age
    let age = currentYear - birthYear;

    // Check if birthday hasn't occurred this year yet
    if (
        currentMonth < birthMonth ||
        (currentMonth === birthMonth && currentDay < birthDay)
    ) {
        age--;
    }

    return age;
}

export function formatDaysOfWeek(days) {
    const allDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const shortMap = {
        Sunday: 'Sun',
        Monday: 'Mon',
        Tuesday: 'Tue',
        Wednesday: 'Wed',
        Thursday: 'Thu',
        Friday: 'Fri',
        Saturday: 'Sat',
    };

    // Normalize input (avoid duplicates, ignore case issues if needed)
    const uniqueDays = Array.from(new Set(days));

    if (uniqueDays.length === 7) {
        return 'Everyday';
    }

    // Keep order consistent as in allDays
    const sortedDays = allDays.filter(day => uniqueDays.includes(day));

    return sortedDays.map(day => shortMap[day]).join(' | ');
}

export function extractSrcFromIframe(iframe) {
    const match = iframe.match(/src="([^"]+)"/i);
    const src = match ? match[1] : null;
    return src;
}

export function extractQueryParam(queryString, paramName) {
    // Remove leading '?' if present
    const cleanQuery = queryString.startsWith('?')
        ? queryString.slice(1)
        : queryString;

    // Create URLSearchParams object
    const params = new URLSearchParams(cleanQuery);

    // Get the parameter value
    return params.get(paramName);
}

export function extractQueryParamRegex(queryString, paramName) {
    const regex = new RegExp(`[?&]${paramName}=([^&]*)`);
    const match = queryString.match(regex);
    return match ? decodeURIComponent(match[1]) : null;
}

export function getAdultPrice(trip) {
    return trip?.pricingConfig?.ageCategoryPricing?.adultsPrice || 0;
}

// Sort function for trips based on sort parameter
export function sortTrips(trips, sortValue) {
    if (!Array.isArray(trips)) return [];

    // Create a copy to avoid mutating original array
    const sortedTrips = [...trips];

    switch (sortValue) {
        case 'price-low':
            return sortedTrips.sort((a, b) => {
                const priceA = getAdultPrice(a);
                const priceB = getAdultPrice(b);
                return priceA - priceB; // Ascending order (low to high)
            });

        case 'price-high':
            return sortedTrips.sort((a, b) => {
                const priceA = getAdultPrice(a);
                const priceB = getAdultPrice(b);
                return priceB - priceA; // Descending order (high to low)
            });

        default:
            // Return original order if no valid sort parameter
            return sortedTrips;
    }
}

