import { z } from 'zod';
import { categoriesTypes } from '../enum';

// Basic information validation
export const basicInfoSchema = z.object({
    title: z
        .string()
        .min(1, 'Package Title is required')
        .optional()
        .default(''),
    shortDescription: z
        .string()
        .min(1, 'Short description of your package is required')
        .optional()
        .default(''),
    fullDescription: z
        .string()
        .min(1, 'Full description of your package is required')
        .optional()
        .default(''),
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
    ),

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
        .default([]),
    startingPrice: z
        .number()
        .min(0, 'Starting price must be 0 or greater')
        .default(0),
    currency: z.string().default('USD'),
    durationDays: z
        .number()
        .min(1, 'Duration must be at least 1 day')
        .default(1),
    durationNights: z.number().min(0, 'Nights cannot be negative').default(0),
    destinationId: z
        .string()
        .min(1, 'Destination is required')
        .optional()
        .default(''),
});

// Tour type validation

export const categorySchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    types: z.array(categoriesTypes).min(1, {
        message: 'Please select at least one category type.',
    }),
});

export const tourTypeSchema = z.object({
    tourTypes: z
        .array(z.string())
        .min(1, 'At least one tour type is required')
        .default([]),
    difficulty: z.string().default(''),
    suitableFor: z.array(z.string()).default([]),
    tourStyle: z.string().default(''),
});

export const datesAvailabilitySchema = z
    .object({
        isFixedDeparture: z.boolean().default(false),
        departureDates: z.array(z.string()).default([]),
        dateRangeStart: z.string().nullable().optional(),
        dateRangeEnd: z.string().nullable().optional(),
        blackoutDates: z.array(z.string()).default([]),
        minAdvanceBooking: z.number().int().nullable().optional(),
        maxLastMinute: z.number().int().nullable().optional(),
    })
    .superRefine((data, ctx) => {
        // When using fixed departure dates, at least one valid date is required
        if (data.isFixedDeparture) {
            // Check if departureDates array exists and has at least one non-empty date
            const hasValidDepartureDates =
                data.departureDates &&
                data.departureDates.length > 0 &&
                data.departureDates.some(date => date && date.trim() !== '');

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
            if (!data.dateRangeEnd || data.dateRangeEnd.trim() === '') {
                ctx.addIssue({
                    path: ['dateRangeEnd'],
                    code: z.ZodIssueCode.custom,
                    message:
                        'End date is required when not using fixed departure dates',
                });
            }
        }

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

// Highlights validation
export const highlightSchema = z.object({
    title: z
        .string()
        .min(1, 'Highlight title is required')
        .optional()
        .default(''),
    description: z
        .string()
        .min(1, 'Highlight description is required')
        .optional()
        .default(''),
    images: z
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
        .default([]),
});

// Updated Activity Schema - made all fields optional and removed image field
export const activitySchema = z.object({
    id: z.string().optional().default(''),
    name: z.string().min(1, 'Activity name is required').default(''),
    duration: z.string().optional().default(''),
    difficulty: z.string().optional().default(''), // Changed from Difficulty enum to string to match mock data
    price: z.number().optional().default(0),
    isHighlight: z.boolean().optional().default(false),
    description: z.string().optional().default(''),
    locationId: z
        .string()
        .min(1, 'Location is required')
        .optional()
        .default(''),
    images: z
        .array(
            z.any().refine(
                image => {
                    // Accept cloud image objects with URL
                    if (image && typeof image === 'object' && image.url)
                        return true;
                    // Accept File objects (during upload)
                    if (image instanceof File) return true;
                    // Accept string URLs for mock data
                    if (typeof image === 'string') return true;
                    return false;
                },
                {
                    message: 'Invalid image format',
                }
            )
        )
        .optional()
        .default([]),
});

// Updated Sightseeing Schema - made all fields optional and removed image field
export const sightseeingSchema = z.object({
    id: z.string().optional().default(''),
    name: z.string().min(1, 'Name is Required').default(''),
    duration: z.string().optional().default(''),
    price: z.number().optional().default(0),
    currency: z.string().optional().default('USD - US Dollar'),
    description: z.string().optional().default(''),
    location: z.string().min(1, 'Location is Required').default(''),
    images: z
        .array(
            z.any().refine(
                image => {
                    // Accept cloud image objects with URL
                    if (image && typeof image === 'object' && image.url)
                        return true;
                    // Accept File objects (during upload)
                    if (image instanceof File) return true;
                    // Accept string URLs for mock data
                    if (typeof image === 'string') return true;
                    return false;
                },
                {
                    message: 'Invalid image format',
                }
            )
        )
        .min(1, 'At least one image is required for sightseeing')
        .default([]),
});

// Updated Dietary Options Schema
const DietaryOptionsSchema = z.object({
    vegetarian: z.boolean().optional().default(false),
    vegan: z.boolean().optional().default(false),
    glutenFree: z.boolean().optional().default(false),
    dairyFree: z.boolean().optional().default(false),
    nutFree: z.boolean().optional().default(false),
    shellfish: z.boolean().optional().default(false),
    halal: z.boolean().optional().default(false),
    kosher: z.boolean().optional().default(false),
});

// Updated Meals Schema - made all fields optional and removed image field
export const mealsSchema = z.object({
    id: z.string().optional().default(''),
    name: z.string().min(1, 'Meal name is required').default(''),
    price: z.number().optional().default(0),
    category: z.string().min(1, 'Please select a meal category').default(''), // Changed from MealCategory enum to string to match mock data
    description: z.string().optional().default(''),
    dietaryOptions: DietaryOptionsSchema.optional().default({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        nutFree: false,
        shellfish: false,
        halal: false,
        kosher: false,
    }),
    images: z
        .array(
            z.any().refine(
                image => {
                    // Accept cloud image objects with URL
                    if (image && typeof image === 'object' && image.url)
                        return true;
                    // Accept File objects (during upload)
                    if (image instanceof File) return true;
                    // Accept string URLs for mock data
                    if (typeof image === 'string') return true;
                    return false;
                },
                {
                    message: 'Invalid image format',
                }
            )
        )
        .optional()
        .default([]),
});

export const itineraryDaySchema = z
    .object({
        dayNumber: z.number().int().min(1, 'Day number is required').default(1),
        title: z.string().min(1, 'Day title is required').default(''),
        description: z
            .string()
            .min(1, 'Day description is required')
            .default(''),
        hasFlight: z.boolean().optional().default(false),
        hasAirportTransfer: z.boolean().optional().default(false),
        transferCarId: z
            .string()
            .nullable()
            .transform(val => val ?? '')
            .default(''),
        hasOvernightStay: z.boolean().optional().default(false),
        hotelId: z
            .string()
            .nullable()
            .transform(val => val ?? '')
            .default(''),
        mealIds: z.array(z.string().optional()).default([]),
        activityId: z
            .string()
            .nullable()
            .transform(val => val ?? '')
            .default(''),
        sightseeingId: z
            .string()
            .nullable()
            .transform(val => val ?? '')
            .default(''),
        routes: z
            .object({
                from: z
                    .string()
                    .nullable()
                    .transform(val => val ?? '')
                    .default(''),
                to: z
                    .string()
                    .nullable()
                    .transform(val => val ?? '')
                    .default(''),
                distance: z
                    .string()
                    .nullable()
                    .transform(val => val ?? '')
                    .default(''),
                transportType: z
                    .string()
                    .nullable()
                    .transform(val => val ?? '')
                    .default(''),
            })
            .optional()
            .default({
                from: '',
                to: '',
                distance: '',
                transportType: '',
            }),
    })
    .refine(
        data => {
            // If hasAirportTransfer is true, transferCarId must be provided and non-empty
            if (
                data.hasAirportTransfer &&
                (!data.transferCarId || data.transferCarId.trim() === '')
            ) {
                return false;
            }
            return true;
        },
        {
            message: 'Please select a transfer car for airport transfer',
            path: ['transferCarId'],
        }
    )
    .refine(
        data => {
            // If hasOvernightStay is true, hotelId must be provided and non-empty
            if (
                data.hasOvernightStay &&
                (!data.hotelId || data.hotelId.trim() === '')
            ) {
                return false;
            }
            return true;
        },
        {
            message: 'Please select a hotel for overnight stay',
            path: ['hotelId'],
        }
    );
// Inclusions validation
export const inclusionSchema = z.object({
    category: z
        .string()
        .min(1, 'Category is required')
        .optional()
        .default('Accommodation'),
    name: z.string().min(1, 'Name is required').default(''),
    description: z
        .string()
        .min(1, 'Description is required')
        .optional()
        .default(''),
    images: z
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
        .default([]),
});

// Exclusions validation
export const exclusionSchema = z.object({
    category: z
        .string()
        .min(1, 'Category is required')
        .optional()
        .default('Transportation'),
    name: z.string().min(1, 'Name is required').default(''),
    description: z
        .string()
        .min(1, 'Description is required')
        .optional()
        .default(''),
    images: z
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
        .default([]),
});

// Pricing validation
export const pricingTierSchema = z.object({
    name: z
        .string()
        .min(1, 'Tier name is required')
        .optional()
        .default('Standard'),
    basePrice: z.number().min(0, 'Base price must be 0 or greater').default(0),
    ageCategory: z.string().default('ADULT'),
    groupSizeMin: z
        .number()
        .int()
        .min(1, 'Minimum group size must be at least 1')
        .default(1),
    groupSizeMax: z.number().int().nullable().optional(),
    validFrom: z.string().nullable().optional(),
    validUntil: z.string().nullable().optional(),
    singleSupplement: z.number().nullable().optional(),
    seasonType: z.string().nullable().optional(), // LOW, SHOULDER, HIGH, PEAK
});

// Pricing configuration schema
export const pricingConfigSchema = z.object({
    pricingModel: z.string().default('PER_PERSON'), // PER_PERSON, TOTAL_PACKAGE
    bookingPaymentType: z.string().default('FULL_PAYMENT'), // FULL_PAYMENT, DEPOSIT
    depositAmount: z.number().nullable().optional(),
    depositPercentage: z.number().nullable().optional(),
    earlyBirdDiscount: z
        .object({
            isEnabled: z.boolean().default(false),
            daysInAdvance: z.number().nullable().optional(),
            discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
            discountValue: z.number().default(0),
        })
        .optional()
        .default({
            isEnabled: false,
            daysInAdvance: null,
            discountType: 'PERCENTAGE',
            discountValue: 0,
        }),
    lastMinuteRates: z
        .object({
            isEnabled: z.boolean().default(false),
            daysBeforeDeparture: z.number().nullable().optional(),
            discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
            discountValue: z.number().default(0),
        })
        .optional()
        .default({
            isEnabled: false,
            daysBeforeDeparture: null,
            discountType: 'PERCENTAGE',
            discountValue: 0,
        }),
    lengthOfStayPricing: z
        .array(
            z.object({
                minNights: z.number(),
                maxNights: z.number().nullable().optional(),
                discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
                discountValue: z.number().default(0),
            })
        )
        .optional()
        .default([]),
    ageCategoryPricing: z
        .array(
            z.object({
                ageCategory: z.string(), // INFANT, CHILD, YOUTH, ADULT, SENIOR
                ageMin: z.number().int(),
                ageMax: z.number().int(),
                discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED, FIXED_PRICE
                discountValue: z.number().default(0),
            })
        )
        .optional()
        .default([]),
    groupDiscounts: z
        .array(
            z.object({
                minGroupSize: z.number(),
                discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
                discountValue: z.number().default(0),
            })
        )
        .optional()
        .default([]),
    complimentaryPolicies: z
        .array(
            z.object({
                thresholdGroupSize: z.number(),
                complimentarySpots: z.number().default(1),
            })
        )
        .optional()
        .default([]),
    corporateRates: z
        .object({
            isEnabled: z.boolean().default(false),
            discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
            discountValue: z.number().default(0),
        })
        .optional()
        .default({
            isEnabled: false,
            discountType: 'PERCENTAGE',
            discountValue: 0,
        }),
    specialEventSurcharges: z
        .array(
            z.object({
                eventName: z.string(),
                startDate: z.string(),
                endDate: z.string(),
                discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
                discountValue: z.number().default(0),
            })
        )
        .optional()
        .default([]),
    holidaySurcharges: z
        .array(
            z.object({
                holidayName: z.string(),
                date: z.string(),
                discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
                discountValue: z.number().default(0),
            })
        )
        .optional()
        .default([]),
    familyPackages: z
        .array(
            z.object({
                description: z.string(),
                adultCount: z.number().default(2),
                childCount: z.number().default(2),
                discount: z.number().default(0),
            })
        )
        .optional()
        .default([]),
    agentCommission: z
        .object({
            commissionTiers: z
                .array(
                    z.object({
                        tierName: z.string(),
                        percentage: z.number().default(0),
                    })
                )
                .default([]),
            overrideOptions: z.boolean().default(false),
        })
        .optional()
        .default({
            commissionTiers: [],
            overrideOptions: false,
        }),
    paymentOptions: z
        .object({
            installmentPlans: z
                .array(
                    z.object({
                        name: z.string(),
                        installmentCount: z.number().default(0),
                        hasProcessingFee: z.boolean().default(false),
                        processingFeePercentage: z
                            .number()
                            .nullable()
                            .optional(),
                    })
                )
                .default([]),
            acceptedCurrencies: z.array(z.string()).default(['USD']),
            paymentMethodSurcharges: z
                .array(
                    z.object({
                        paymentMethod: z.string(),
                        surchargePercentage: z.number().default(0),
                    })
                )
                .default([]),
        })
        .optional()
        .default({
            installmentPlans: [],
            acceptedCurrencies: ['USD'],
            paymentMethodSurcharges: [],
        }),
    promotionalCodes: z
        .array(
            z.object({
                code: z.string(),
                description: z.string(),
                discountType: z.string().default('PERCENTAGE'), // PERCENTAGE, FIXED
                discountValue: z.number().default(0),
                validFrom: z.string().nullable().optional(),
                validUntil: z.string().nullable().optional(),
                usageLimit: z.number().nullable().optional(),
            })
        )
        .optional()
        .default([]),
    loyaltyBenefits: z
        .object({
            isEnabled: z.boolean().default(false),
            discountPercentage: z.number().default(0),
            pointsPerBooking: z.number().default(0),
        })
        .optional()
        .default({
            isEnabled: false,
            discountPercentage: 0,
            pointsPerBooking: 0,
        }),
});

// Restrictions validation
export const restrictionsSchema = z.object({
    minAge: z.number().int().nullable().optional(),
    maxAge: z.number().int().nullable().optional(),
    minGroupSize: z
        .number()
        .int()
        .min(1, 'Minimum group size must be at least 1'),
    maxGroupSize: z.number().int().nullable().optional(),
    physicalRequirements: z.string().default(''),
    accessibilityInfo: z.string().default(''),
    requiredSkills: z.array(z.string()).default([]),
});

// Preparation validation
export const preparationSchema = z.object({
    category: z.string().min(1, 'Category is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    isRequired: z.boolean().default(false),
});

// Policies validation
export const policySchema = z.object({
    type: z.string().min(1, 'Policy type is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
});

// FAQ validation
export const faqSchema = z.object({
    question: z.string().min(1, 'Question is required'),
    answer: z.string().min(1, 'Answer is required'),
    category: z.string().nullable().optional(),
});

// Meeting details validation
const meetingDetailsSchema = z.object({
    meetingPoint: z.string().default(''),
    meetingTime: z.string().default(''),
    endPoint: z.string().default(''),
    endTime: z.string().default(''),
    meetingInstructions: z.string().default(''),
    departureInstructions: z.string().default(''),
});

// Sustainability validation
export const sustainabilitySchema = z.object({
    sustainabilityEfforts: z.string().default(''),
    communityBenefits: z.string().default(''),
    certifications: z.array(z.string()).default([]),
});

// Customization validation
export const customizationOptionSchema = z.object({
    name: z.string().min(1, 'Option name is required').default(''),
    description: z
        .string()
        .min(1, 'Description is required')
        .optional()
        .default(''),
    category: z.string().min(1, 'Category is required').optional().default(''),
    priceImpact: z.string().default(''),
});

// Review validation
export const reviewSchema = z.object({
    rating: z
        .number()
        .min(1, 'Rating is required')
        .max(5, 'Rating cannot exceed 5')
        .optional()
        .default(5),
    title: z.string().nullable().optional(),
    comment: z
        .string()
        .min(1, 'Review comment is required')
        .optional()
        .default(''),
    authorName: z
        .string()
        .min(1, 'Author name is required')
        .optional()
        .default(''),
    reviewDate: z
        .string()
        .default(() => new Date().toISOString().split('T')[0]),
});

// Combine all schemas
export const tripPackageFormSchema = z.object({
    ...basicInfoSchema.shape,
    tourTypes: tourTypeSchema.default({
        tourTypes: [],
        difficulty: 'EASY',
        suitableFor: [],
        tourStyle: 'GROUP',
    }),

    datesAvailability: datesAvailabilitySchema.default({
        isFixedDeparture: false,
        departureDates: [],
        dateRangeStart: null,
        dateRangeEnd: null,
        blackoutDates: [],
        minAdvanceBooking: null,
        maxLastMinute: null,
    }),
    highlights: z.array(highlightSchema).default([]),
    itineraryDays: z.array(itineraryDaySchema).default([]),
    inclusions: z.array(inclusionSchema).default([]),
    exclusions: z.array(exclusionSchema).default([]),
    pricingConfig: pricingConfigSchema.optional().default({
        pricingModel: 'PER_PERSON',
        bookingPaymentType: 'FULL_PAYMENT',
        depositAmount: null,
        depositPercentage: null,
        earlyBirdDiscount: {
            isEnabled: false,
            daysInAdvance: null,
            discountType: 'PERCENTAGE',
            discountValue: 0,
        },
        lastMinuteRates: {
            isEnabled: false,
            daysBeforeDeparture: null,
            discountType: 'PERCENTAGE',
            discountValue: 0,
        },
        ageCategoryPricing: [],
        groupDiscounts: [],
        complimentaryPolicies: [],
        corporateRates: {
            isEnabled: false,
            discountType: 'PERCENTAGE',
            discountValue: 0,
        },
        specialEventSurcharges: [],
        holidaySurcharges: [],
        familyPackages: [],
        agentCommission: {
            commissionTiers: [],
            overrideOptions: false,
        },
        paymentOptions: {
            installmentPlans: [],
            acceptedCurrencies: ['USD'],
            paymentMethodSurcharges: [],
        },
        promotionalCodes: [],
        loyaltyBenefits: {
            isEnabled: false,
            discountPercentage: 0,
            pointsPerBooking: 0,
        },
    }),
    pricingTiers: z.array(pricingTierSchema).default([]),
    restrictions: restrictionsSchema.default({
        minAge: null,
        maxAge: null,
        minGroupSize: 1,
        maxGroupSize: null,
        physicalRequirements: '',
        accessibilityInfo: '',
        requiredSkills: [],
    }),
    preparations: z.array(preparationSchema).default([]),
    policies: z.array(policySchema).default([]),
    faqs: z.array(faqSchema).default([]),
    meetingDetails: meetingDetailsSchema.default({
        meetingPoint: '',
        meetingTime: '',
        endPoint: '',
        endTime: '',
        meetingInstructions: '',
        departureInstructions: '',
    }),
    guideIds: z.array(z.string()).optional().default([]),
    sustainability: sustainabilitySchema.default({
        sustainabilityEfforts: '',
        communityBenefits: '',
        certifications: [],
    }),

    customizationOptions: z.array(customizationOptionSchema).default([]),
    reviews: z.array(reviewSchema).default([]),
    averageRating: z.number().min(0).max(5).nullable().optional(),
});

