import { z } from 'zod';
import { categoriesTypes } from '../enum';

// Basic information validation
export const basicInfoSchema = z.object({
    title: z
        .string()
        .min(1, 'Package Title is required')
        .default('')
        .describe('The main title/name of the trip package. This is a prominent display name that appears on listings and detail pages. Example: "Klein Curacao Super Yacht Adventure" or "Hotel Grand Palace eco lodge - Fixed Itinerary". Should be descriptive and engaging to attract potential travelers.'),

    duration: z
        .string()
        .optional()
        .default('')
        .describe('The total duration of the trip package. Can be specified in hours (e.g., "10 Hours") or days (e.g., "3 Days 2 Nights"). This helps travelers understand the time commitment required for the trip.'),

    shortDescription: z
        .string()
        .min(1, 'Short description of your package is required')
        .default('')
        .describe('A concise summary of the trip package (typically 150-300 characters). This appears in search results, listings, and previews. Should highlight the main selling points and unique features of the trip. Example: "Travel to Klein Curacao on a Super Yacht, enjoy stunning views, spot dolphins, and relax at a private beach house with unlimited drinks and BBQ lunch."'),

    fullDescription: z
        .string()
        .min(1, 'Full description of your package is required')
        .default('')
        .describe('The complete, detailed description of the trip package. Can include HTML formatting (e.g., "<p>a dfsad daf adsf </p>"). This is the main content that appears on the trip detail page and should provide comprehensive information about the experience, what to expect, and why travelers should book this trip.'),

    // Updated image validation for cloud URLs
    mainImage: z.any().refine(
        image => {
            // Accept cloud image objects with URL
            if (image && typeof image === 'object' && image.url) return true;
            // Accept File objects (during upload)
            if (image instanceof File) return true;
            return false;
        },
        {
            message: 'Main image is required',
        }
    ).describe('The primary hero image for the trip package. This is the main visual representation shown on listing pages and at the top of detail pages. Should be a high-quality, engaging image that captures the essence of the trip. Can be either a File object (during upload) or a cloud image object with properties like {url, thumbnail, originalName, size, format, width, height}. Note: You will ignore this field during AI generation - users may manually add the image after creating the package.'),

    galleryImages: z
        .array(
            z.any().refine(
                image => {
                    // Accept cloud image objects with URL
                    if (image && typeof image === 'object' && image.url)
                        return true;
                    // Accept File objects (during upload)
                    if (image instanceof File) return true;
                    return false;
                },
                {
                    message: 'Invalid image format',
                }
            )
        )
        .default([])
        .describe('An array of additional images showcasing different aspects of the trip (activities, locations, accommodations, etc.). Each image can be either a File object or a cloud image object with URL. These images appear in a gallery on the trip detail page. Note: You can ignore this field during AI generation - users may manually add gallery images after creating the package.'),

    destinationId: z
        .string()
        .min(1, 'Destination is required')
        .default('')
        .describe('UUID reference to the destination where this trip takes place. Links to a destination object containing details like name (e.g., "Hotel Grand Palace eco lodge"), country (e.g., "Bangladesh"), city (e.g., "Nalitabari"), region, and embedded map. This helps categorize and filter trips by location. Note: You will ignore this field during AI generation - users may manually select the destination after creating the package.'),
    partnerId: z
        .string()
        .min(1, 'Tour operator (Affiliate) is required')
        .default(''),
})
    .describe('Core basic information schema for a trip package. Contains essential details like title, descriptions, duration, images, and destination reference. This forms the foundation of a trip listing and is what travelers see first when browsing or viewing trip details.');

// Tour type validation

export const categorySchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Name must be at least 2 characters.',
        })
        .describe('The category name for the trip package. This is a classification label that helps organize trips. Minimum 2 characters required.'),

    types: z
        .array(categoriesTypes)
        .min(1, {
            message: 'Please select at least one category type.',
        })
        .describe('An array of tour type classifications for this trip. Examples include: "Adventure Tours", "Wildlife Safari", "Cultural Tours", "Beach & Island", "City Tours", etc. At least one type must be selected. This helps travelers filter and find trips that match their interests.'),
})
    .describe('Tour category schema defining the type and classification of the trip. Includes tourTypes (e.g., Adventure Tours, Wildlife Safari), difficulty level (e.g., "Challenging - Good fitness required"), suitableFor (e.g., Families with Kids, Solo Travelers), and tourStyle (e.g., Fixed Itinerary, Flexible). This helps travelers understand if the trip matches their preferences and capabilities.');

export const datesAvailabilitySchema = z
    .object({
        isFixedDeparture: z
            .boolean()
            .default(false)
            .describe('Indicates whether the trip operates on fixed departure dates only. If true, the trip departs only on specific pre-scheduled dates (defined in departureDates array). If false, the trip is available within a date range and can depart on selected days of the week. Example: A group tour might have fixed departures every Saturday.'),

        onlyUponRequest: z
            .boolean()
            .default(false)
            .describe('Indicates whether the trip is only available upon special request. If true, travelers must contact the operator to check availability and schedule the trip. This overrides other availability settings. Useful for exclusive or customized experiences.'),

        departureDates: z
            .array(z.string())
            .default([])
            .describe('An array of specific departure dates when isFixedDeparture is true. Each date should be in ISO format (YYYY-MM-DD). Example: ["2025-11-28", "2025-12-05", "2025-12-12"]. These are the only dates when the trip will depart. Required when isFixedDeparture is true and onlyUponRequest is false.'),

        departureTimes: z
            .array(z.string())
            .default(['07:30:00'])
            .describe('An array of departure times. format: HH:MM:SS'),

        daysOfTheWeek: z
            .array(z.string())
            .default([])
            .describe('An array of days of the week when the trip operates. Example: ["Monday", "Wednesday"].'),

        dateRangeStart: z
            .string()
            .nullable()
            .optional()
            .describe('The start date of the availability period when using flexible scheduling (isFixedDeparture is false). Format: YYYY-MM-DD. Example: "2025-11-28". The trip can be booked on eligible days of the week starting from this date. Required when not using fixed departures and not only upon request.'),

        dateRangeEnd: z
            .string()
            .nullable()
            .optional()
            .describe('The end date of the availability period when using flexible scheduling. Format: YYYY-MM-DD. Optional - if not provided, the trip remains available indefinitely (or until manually changed). Must be after dateRangeStart if both are provided.'),

        blackoutDates: z
            .array(z.string())
            .default([])
            .describe('An array of dates when the trip is NOT available, even if it falls within the normal availability period. Format: YYYY-MM-DD. Example: ["2025-12-25", "2026-01-01"] for holidays. These dates are excluded from booking regardless of other settings.'),
        /*      minAdvanceBooking: z.number().int().nullable().optional(),
        maxLastMinute: z.number().int().nullable().optional(), */
    })
    .superRefine((data, ctx) => {
        if (!data.onlyUponRequest) {
            if (data.isFixedDeparture) {
                // Check if departureDates array exists and has at least one non-empty date
                const hasValidDepartureDates =
                    data.departureDates &&
                    data.departureDates.length > 0 &&
                    data.departureDates.some(
                        date => date && date.trim() !== ''
                    );

                if (!hasValidDepartureDates) {
                    ctx.addIssue({
                        path: ['departureDates'],
                        code: z.ZodIssueCode.custom,
                        message:
                            'At least one departure date is required when using fixed departure dates',
                    });
                }
            } else {
                // When not using fixed dates, start date is required
                if (!data.dateRangeStart || data.dateRangeStart.trim() === '') {
                    ctx.addIssue({
                        path: ['dateRangeStart'],
                        code: z.ZodIssueCode.custom,
                        message:
                            'Start date is required when not using fixed departure dates',
                    });
                }
            }
        }
        // When using fixed departure dates, at least one valid date is required

        // If both start and end date are provided, validate that end date is after start date
        if (data.dateRangeStart && data.dateRangeEnd) {
            const startDate = new Date(data.dateRangeStart);
            const endDate = new Date(data.dateRangeEnd);

            if (endDate < startDate) {
                ctx.addIssue({
                    path: ['dateRangeEnd'],
                    code: z.ZodIssueCode.custom,
                    message: 'End date must be after start date',
                });
            }
        }
    });

// Pricing configuration schema
export const pricingConfigSchema = z.object({
    pricingModel: z
        .string()
        .default('PER_PERSON')
        .describe('The pricing model for the trip package. Options: "PER_PERSON" (price is per traveler, most common for tours) or "TOTAL_PACKAGE" (fixed price for the entire group/package regardless of number of people). Includes additional pricing details like currency (e.g., "USD - US Dollar"), tax settings (includedTax, taxPercentage), service charges (includedServiceCharge, serviceCharge), age category pricing (adults, children, infants with their respective price points and age ranges), and affiliate commission structure (commissionType: "PERCENTAGE" or "FIXED", commissionValue).'),
})
    .describe('Complete pricing configuration for the trip package. Defines how the trip is priced, what is included in the price, and commission structure for affiliates.');

// Customization validation
export const additionalOptionsSchema = z.object({
    name: z
        .string()
        .min(1, 'Option name is required')
        .optional()
        .default('')
        .describe('The name of the additional option or add-on service. Examples: "Special BARBQ", "Scuba Diving", "Massage", "Transfer Service", "Alcoholic beverages". This appears in the booking form as a selectable option.'),

    description: z
        .string()
        .optional()
        .default('')
        .describe('A brief description explaining what this additional option includes or provides. Helps travelers understand what they are paying extra for.'),

    priceImpact: z
        .number()
        .default(0)
        .describe('The additional cost for this option in the trip\'s currency. Can be positive (extra charge) or negative (discount). Example: 23 means $23 extra, -10 means $10 discount. This amount is added to the base trip price when the option is selected.'),
})
    .describe('Schema for additional options, add-ons, or customizations available for the trip. These are optional extras that travelers can add to their booking for an additional cost (or sometimes included). Examples include equipment rentals, meal upgrades, transfer services, or special activities. Each option has a name, description, price impact, and an isExtra flag indicating if it is truly optional or included by default.');

// Combine all schemas
export const tripPackageFormSchema = z.object({
    ...basicInfoSchema.shape,

    datesAvailability: datesAvailabilitySchema.default({
        isFixedDeparture: false,
        onlyUponRequest: false,
        departureDates: [],
        dateRangeStart: null,
        dateRangeEnd: null,
        blackoutDates: [],
        minAdvanceBooking: null,
        maxLastMinute: null,
    }),

    pricingConfig: pricingConfigSchema.optional().default({
        pricingModel: 'PER_PERSON',
        ageCategoryPricing: [],
    }),

    highlights: z
        .array(z.string())
        .default([])
        .describe('List of main attractions and experiences. 4-8 compelling bullet points.'),

    whatIsIncluded: z
        .array(z.string())
        .default([])
        .describe('List of items and services included in the price (meals, transport, equipment, etc.).'),

    meetingPoint: z
        .string()
        .optional()
        .default('')
        .describe('Location where travelers should meet. Include address and Google Maps link if possible.'),

    meetingTime: z
        .string()
        .optional()
        .default('')
        .describe('Time when travelers should arrive.'),

    additionals: z.array(additionalOptionsSchema).default([]),
})
    .describe('Complete trip package form schema combining all aspects of a trip listing. This is the main schema used for creating and editing affiliate trip packages. It includes: (1) Basic Info - title, descriptions, duration, images, destination; (2) Dates & Availability - scheduling options including fixed departures, date ranges, days of week, departure times, and blackout dates; (3) Pricing Config - pricing model, currency, tax settings, service charges, age-based pricing (adults/children/infants), and affiliate commission; (4) Additionals - array of optional add-ons and extras. Additional related data not in this schema but part of the complete trip object includes: tourCategory (tour types, difficulty, suitableFor, tourStyle), pickups (pickup locations), activities (included activities), affiliate info, destination details, SEO metadata, and userAddedOptions (experience sections like highlights, descriptions, what\'s included, meeting points).');

