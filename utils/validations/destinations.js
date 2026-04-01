import { z } from 'zod';

export const destination = z.object({
    name: z.string().min(1, 'Destination name is required').default(''),
    description: z.string().optional().default(''),
    country: z.string().min(1, 'Country name is required').default(''),
    city: z.string().optional().default(''),
    region: z.string().optional().default(''),
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
    embededMap: z.string().optional(),
});

