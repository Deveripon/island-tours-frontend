import { z } from 'zod';

export const transportation = z.object({
    // Basic transportation info
    name: z.string().min(1, 'Transportation name is required').default(''),
    type: z.enum(
        [
            'SEDAN',
            'SUV',
            'HATCHBACK',
            'COUPE',
            'CONVERTIBLE',
            'WAGON',
            'PICKUP_TRUCK',
            'VAN',
            'MINIVAN',
            'LUXURY_CAR',
            'SPORTS_CAR',
            'CROSSOVER',
        ],
        {
            errorMap: () => ({ message: 'Please select a valid car type' }),
        }
    ),
    description: z.string().optional().default(''),

    // Pricing
    pricePerPerson: z.coerce.number().min(0, 'Price must be a positive number'),
    currency: z
        .string()
        .min(1, 'Currency is required')
        .default('USD-Us Dollar'),

    // Capacity and availability
    totalSeats: z.coerce.number().min(1, 'Total seats must be at least 1'),

    // Service details
    serviceClass: z
        .enum(['ECONOMY', 'BUSINESS', 'FIRST_CLASS', 'STANDARD', 'PREMIUM'], {
            errorMap: () => ({
                message: 'Please select a valid service class',
            }),
        })
        .optional(),
    provider: z.string().optional().default(''), // e.g., "Uber", "Lyft", "Local Taxi Service"
    vehicleDetails: z.string().optional(), // e.g., "Boeing 737", "Mercedes Sprinter"
    vehicleModel: z.string().optional(), // e.g., "Toyota Camry", "Honda Odyssey"
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
        .max(10, 'Maximum 10 images allowed')
        .default([]),

    isAvailable: z.boolean().default(true), // e.g., "Available", "Unavailable"
    notes: z.string().optional(),
    tags: z.array(z.string()).optional().default([]), // e.g., ["comfortable", "scenic", "fast"]
});

