import { z } from 'zod';

export const hotels = z.object({
    // Basic hotel information
    name: z.string().min(1, 'Hotel name is required').default(''),
    description: z.string().optional().default(''),

    // Location details
    country: z.string().min(1, 'Country name is required').default(''),
    city: z.string().min(1, 'City name is required').default(''),
    region: z.string().optional().default(''),
    address: z.string().min(1, 'Hotel address is required').default(''),
    latitude: z.coerce
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .optional(),
    longitude: z.coerce
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .optional(),

    // Hotel classification
    category: z
        .enum(['BUDGET', 'MID_RANGE', 'LUXURY', 'RESORT', 'BOUTIQUE'])
        .default('MID_RANGE'),
    starRating: z.number().min(1).max(5).optional(),
    quality: z
        .enum(['ONE_STAR', 'TWO_STAR', 'THREE_STAR', 'FOUR_STAR', 'FIVE_STAR'])
        .default('THREE_STAR'),
    // Room information
    rooms: z
        .array(
            z.object({
                type: z.enum([
                    'SINGLE',
                    'DOUBLE',
                    'TWIN',
                    'SUITE',
                    'FAMILY',
                    'DELUXE',
                ]),
                capacity: z.coerce
                    .number()
                    .min(1, 'Room capacity must be at least 1'),
                pricePerNight: z.coerce
                    .number()
                    .min(0, 'Price must be non-negative'),
                amenities: z.array(z.string()).optional().default([]),
                available: z.boolean().default(true),
            })
        )
        .min(1, 'At least one room type is required'),

    // Hotel amenities
    amenities: z
        .array(
            z.enum([
                'WIFI',
                'PARKING',
                'POOL',
                'GYM',
                'SPA',
                'RESTAURANT',
                'BAR',
                'ROOM_SERVICE',
                'CONCIERGE',
                'LAUNDRY',
                'BUSINESS_CENTER',
                'PET_FRIENDLY',
                'AIRPORT_SHUTTLE',
                'BREAKFAST_INCLUDED',
            ])
        )
        .default([]),

    // Contact and booking
    contact: z.object({
        phone: z.string().min(1, 'Phone number is required'),
        email: z.string().email('Valid email is required'),
    }),

    // Policies
    policies: z
        .object({
            cancellationPolicy: z
                .string()
                .min(1, 'Cancellation policy is required'),
            childPolicy: z.string().optional(),
            petPolicy: z.string().optional(),
        })
        .optional(),

    // Media
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
        .min(1, 'At least one image is required')
        .default([]),
    embededMap: z.string().optional().default(''),
    videoTour: z.string().optional().default(''),
    isActive: z.boolean().default(true),
    featured: z.boolean().default(false),
});

