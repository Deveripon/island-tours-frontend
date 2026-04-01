/**
 * Enhanced Currency Functions with Price Difference Formatting
 */

// Your existing currency mapping object (enhanced)
const currencyMap = {
    // US Dollar
    usd: '$',
    dollar: '$',
    'us dollar': '$',
    'american dollar': '$',
    'united states dollar': '$',

    // Euro
    eur: '€',
    euro: '€',
    euros: '€',

    // British Pound
    gbp: '£',
    pound: '£',
    'british pound': '£',
    sterling: '£',
    'pound sterling': '£',

    // Japanese Yen
    jpy: '¥',
    yen: '¥',
    'japanese yen': '¥',

    // Chinese Yuan
    cny: '¥',
    yuan: '¥',
    'chinese yuan': '¥',
    rmb: '¥',
    renminbi: '¥',

    // Indian Rupee
    inr: '₹',
    rupee: '₹',
    'indian rupee': '₹',
    rupees: '₹',

    // Canadian Dollar
    cad: 'C$',
    'canadian dollar': 'C$',
    'cad dollar': 'C$',

    // Australian Dollar
    aud: 'A$',
    'australian dollar': 'A$',
    'aud dollar': 'A$',

    // Swiss Franc
    chf: '₣',
    franc: '₣',
    'swiss franc': '₣',

    // South Korean Won
    krw: '₩',
    won: '₩',
    'korean won': '₩',
    'south korean won': '₩',

    // Russian Ruble
    rub: '₽',
    ruble: '₽',
    'russian ruble': '₽',
    rouble: '₽',

    // Brazilian Real
    brl: 'R$',
    real: 'R$',
    'brazilian real': 'R$',
    reais: 'R$',

    // Mexican Peso
    mxn: '$',
    peso: '$',
    'mexican peso': '$',

    // Turkish Lira
    try: '₺',
    lira: '₺',
    'turkish lira': '₺',

    // South African Rand
    zar: 'R',
    rand: 'R',
    'south african rand': 'R',

    // Singapore Dollar
    sgd: 'S$',
    'singapore dollar': 'S$',
    'sgd dollar': 'S$',

    // Hong Kong Dollar
    hkd: 'HK$',
    'hong kong dollar': 'HK$',
    'hkd dollar': 'HK$',

    // New Zealand Dollar
    nzd: 'NZ$',
    'new zealand dollar': 'NZ$',
    'nzd dollar': 'NZ$',

    // Norwegian Krone
    nok: 'kr',
    krone: 'kr',
    'norwegian krone': 'kr',

    // Swedish Krona
    sek: 'kr',
    krona: 'kr',
    'swedish krona': 'kr',

    // Danish Krone
    dkk: 'kr',
    'danish krone': 'kr',

    // Thai Baht
    thb: '฿',
    baht: '฿',
    'thai baht': '฿',

    // Bitcoin
    btc: '₿',
    bitcoin: '₿',
    bitcoins: '₿',

    // Ethereum
    eth: 'Ξ',
    ethereum: 'Ξ',

    // Bangladesh Taka
    bdt: '৳',
    taka: '৳',
    'bangladeshi taka': '৳',

    // Pakistani Rupee
    pkr: '₨',
    'pakistani rupee': '₨',
    'pak rupee': '₨',

    // Sri Lankan Rupee
    lkr: '₨',
    'sri lankan rupee': '₨',

    // UAE Dirham
    aed: 'د.إ',
    dirham: 'د.إ',
    'uae dirham': 'د.إ',

    // Saudi Riyal
    sar: '﷼',
    riyal: '﷼',
    'saudi riyal': '﷼',

    // Israeli Shekel
    ils: '₪',
    shekel: '₪',
    'israeli shekel': '₪',

    // Egyptian Pound
    egp: '£',
    'egyptian pound': '£',

    // Philippine Peso
    php: '₱',
    'philippine peso': '₱',
    'filipino peso': '₱',

    // Vietnamese Dong
    vnd: '₫',
    dong: '₫',
    'vietnamese dong': '₫',

    // Indonesian Rupiah
    idr: 'Rp',
    rupiah: 'Rp',
    'indonesian rupiah': 'Rp',

    // Malaysian Ringgit
    myr: 'RM',
    ringgit: 'RM',
    'malaysian ringgit': 'RM',
};

// Enhanced locale mapping for better number formatting
const localeMap = {
    usd: 'en-US',
    eur: 'de-DE',
    gbp: 'en-GB',
    jpy: 'ja-JP',
    cny: 'zh-CN',
    inr: 'en-IN',
    cad: 'en-CA',
    aud: 'en-AU',
    chf: 'de-CH',
    krw: 'ko-KR',
    rub: 'ru-RU',
    brl: 'pt-BR',
    mxn: 'es-MX',
    try: 'tr-TR',
    zar: 'en-ZA',
    sgd: 'en-SG',
    hkd: 'zh-HK',
    nzd: 'en-NZ',
    nok: 'nb-NO',
    sek: 'sv-SE',
    dkk: 'da-DK',
    thb: 'th-TH',
    bdt: 'bn-BD',
    pkr: 'ur-PK',
    aed: 'ar-AE',
    sar: 'ar-SA',
    php: 'en-PH',
    vnd: 'vi-VN',
    idr: 'id-ID',
    myr: 'ms-MY',
};

/**
 * Parses various currency formats and returns the lowercase currency code for Stripe
 * @param {string} currencyInput - Currency in various formats like "USD", "USD - US Dollar", "usd", etc.
 * @returns {string|null} - Lowercase currency code or null if not found
 */
export function parseCurrencyForStripe(currencyInput) {
    // Return usd as default for invalid input
    if (!currencyInput || typeof currencyInput !== 'string') {
        return 'usd';
    }

    // Clean the input: trim whitespace and convert to lowercase
    const cleanInput = currencyInput.trim().toLowerCase();

    // Extract currency code using regex
    // This matches 3-letter currency codes at the beginning of the string
    const currencyMatch = cleanInput.match(/^([a-z]{3})/);

    if (!currencyMatch) {
        return 'usd';
    }

    const currencyCode = currencyMatch[1];

    // Check if the currency exists in our localeMap
    if (localeMap.hasOwnProperty(currencyCode)) {
        return currencyCode;
    }

    return 'usd';
}

/**
 * Get currency symbol/icon based on currency name or code
 * @param {string} currencyName - Currency name or code (case insensitive)
 * @returns {string} - Currency symbol/icon
 */
function getCurrencyIcon(currencyName) {
    if (!currencyName || typeof currencyName !== 'string') {
        return '$'; // Generic currency symbol
    }

    // Convert to lowercase for case-insensitive matching
    const currency = currencyName.toLowerCase().trim();

    // Check for exact match first
    if (currencyMap[currency]) {
        return currencyMap[currency];
    }

    // Check if currency name contains any of the keys
    for (const [key, symbol] of Object.entries(currencyMap)) {
        if (currency.includes(key) || key.includes(currency)) {
            return symbol;
        }
    }

    // If no match found, return generic currency symbol
    return '$';
}

/**
 * Get currency info (symbol + code + locale)
 * @param {string} currencyName - Currency name or code
 * @returns {object} - Currency information object
 */
function getCurrencyInfo(currencyName) {
    if (!currencyName || typeof currencyName !== 'string') {
        return {
            symbol: '$',
            code: 'XXX',
            locale: 'en-US',
            display: '$ (XXX)',
        };
    }

    const symbol = getCurrencyIcon(currencyName);
    const normalizedCode = currencyName.toLowerCase().trim();
    const code = currencyName.toUpperCase().substring(0, 3);
    const locale = localeMap[normalizedCode] || 'en-US';

    return {
        symbol: symbol,
        code: code,
        locale: locale,
        display: `${symbol} (${code})`,
    };
}

/**
 * Format currency amount with proper locale formatting
 * @param {number} amount - Amount to format
 * @param {string} currencyName - Currency name or code
 * @param {object} options - Formatting options
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount, currencyName, options = {}) {
    const {
        showDecimals = true,
        locale = null,
        useIntlFormat = true,
    } = options;

    if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0';
    }

    const currencyInfo = getCurrencyInfo(currencyName);
    const targetLocale = locale || currencyInfo.locale;

    if (useIntlFormat) {
        try {
            const formatter = new Intl.NumberFormat(targetLocale, {
                style: 'currency',
                currency: currencyInfo.code,
                minimumFractionDigits: showDecimals ? 2 : 0,
                maximumFractionDigits: showDecimals ? 2 : 0,
            });
            return formatter.format(amount);
        } catch (error) {
            // Fallback to manual formatting if Intl fails
        }
    }

    // Fixed fallback formatting
    const absAmount = Math.abs(amount);
    const isNegative = amount < 0;

    // Force decimal places when showDecimals is true
    const formattedNumber = showDecimals
        ? absAmount.toFixed(2)
        : Math.round(absAmount).toString();

    // Add thousand separators manually if needed
    const parts = formattedNumber.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1] ? `.${parts[1]}` : '';
    const finalNumber = integerPart + decimalPart;

    const sign = isNegative ? '-' : '';
    return `${sign}${currencyInfo.symbol}${finalNumber}`;
}

/**
 * Format price difference with +/- signs and bold markdown
 * @param {number} difference - Price difference amount
 * @param {string} currencyName - Currency name or code
 * @param {object} options - Formatting options
 * @returns {string} - Formatted price difference with markdown
 */
function formatPriceDifference(difference, currencyName, options = {}) {
    const {
        showDecimals = true,
        locale = null,
        useIntlFormat = true,
        boldFormat = false,
        showZero = true,
    } = options;

    if (typeof difference !== 'number' || isNaN(difference)) {
        return boldFormat ? '**$0**' : '$0';
    }

    // Handle zero case
    if (difference === 0) {
        if (!showZero) return '';
        const zeroFormatted = formatCurrency(0, currencyName, {
            showDecimals,
            locale,
            useIntlFormat,
        });
        return boldFormat ? `**${zeroFormatted}**` : zeroFormatted;
    }

    // Get currency info
    const currencyInfo = getCurrencyInfo(currencyName);
    const targetLocale = locale || currencyInfo.locale;

    // Format the actual difference value (preserving sign)
    let formattedAmount;

    if (useIntlFormat) {
        try {
            const formatter = new Intl.NumberFormat(targetLocale, {
                minimumFractionDigits: showDecimals ? 2 : 0,
                maximumFractionDigits: showDecimals ? 2 : 0,
            });
            formattedAmount = formatter.format(Math.abs(difference)); // Format absolute value for display
        } catch (error) {
            formattedAmount = Math.abs(difference).toLocaleString(
                targetLocale,
                {
                    minimumFractionDigits: showDecimals ? 2 : 0,
                    maximumFractionDigits: showDecimals ? 2 : 0,
                }
            );
        }
    } else {
        formattedAmount = Math.abs(difference).toLocaleString(targetLocale, {
            minimumFractionDigits: showDecimals ? 2 : 0,
            maximumFractionDigits: showDecimals ? 2 : 0,
        });
    }

    // Add proper sign and currency symbol
    const sign = difference > 0 ? '+' : '-';
    const result = `${sign}${currencyInfo.symbol}${formattedAmount}`;

    return boldFormat ? `**${result}**` : result;
}
// Your original hotel price difference calculation with enhanced formatting
function calculateAndFormatPriceDifference(
    includedHotel,
    currentRoom,
    currencyName,
    options = {}
) {
    // Get the price difference
    const includedHotelPrice =
        (includedHotel?.rooms &&
            includedHotel.rooms.length > 0 &&
            includedHotel.rooms[0].pricePerNight) ||
        0;

    const thisHotelPrice = currentRoom.pricePerNight || 0;

    const difference = thisHotelPrice - includedHotelPrice;

    // Format the difference
    const formattedDifference = formatPriceDifference(
        difference,
        currencyName,
        options
    );

    return {
        includedHotelPrice,
        thisHotelPrice,
        difference,
        formattedDifference,
        currencyInfo: getCurrencyInfo(currencyName),
    };
}

// Export functions
export {
    calculateAndFormatPriceDifference,
    formatCurrency,
    formatPriceDifference,
    getCurrencyIcon,
    getCurrencyInfo,
};

// Usage Examples:
/*
// Basic usage
const difference = -125;
const currency = 'USD';
*/

