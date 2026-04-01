export const defaultFormValues = {
    // Basic Info
    title: '',
    shortDescription: '',
    fullDescription: '',
    destinationId: '',
    mainImage: null, // Required field - will show validation error if not provided
    galleryImages: [], // Empty array for File objects
    // Dates & Availability
    duration: '',
    affiliateId: '',
    datesAvailability: {
        isFixedDeparture: false,
        onlyUponRequest: false,
        departureDates: [],
        departureTimes: ['07:30:00'],
        dateRangeStart: null,
        blackoutDates: [],
        daysOfTheWeek: [],
    },

    pricingConfig: {
        currency: 'USD - US Dollar',
        pricingModel: 'PER_PERSON',
        includedTax: false,
        taxPercentage: 0,
        includedServiceCharge: true,
        serviceCharge: 0,
        ageCategoryPricing: {
            adults: 'Adults',
            adultsMinAge: 13,
            adultsMaxAge: 100,
            children: 'Children',
            childrenMinAge: 4,
            childrenMaxAge: 12,
            infants: 'Infants',
            infantsMinAge: 0,
            infantsMaxAge: 2,
        },
        affiliateCommission: {
            commissionValue: 0,
            commissionType: 'PERCENTAGE',
        },
    },
    additionals: [],
    seo: {
        title: '',
        description: '',
        focusKeyword: '',
        canonical: '',

        ogTitle: '',
        ogDescription: '',
        ogImage: null,
        twitterTitle: '',
        twitterDescription: '',
        twitterCard: 'summary_large_image',

        robots: 'index,follow',
        schemaType: 'TouristTrip',
        sitemapPriority: 1.0,
        changeFrequency: '',
    },
};

