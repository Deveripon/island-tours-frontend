import { z } from 'zod';

export const addonsSchema = z.object({
    name: z.string().min(1, 'name is required').default(''),
    subtitle: z.string().optional().default(''),
    included: z.string().min(1, 'Included is required').default(''),
    benifits: z.string().min(1, 'Benifits is required').default(''),
    terms_conditions: z
        .string()
        .min(1, 'Terms and Conditions is required')
        .default(''),
    category: z.string().min(1, 'Category is required').default(''),
    pricingModel: z.enum(['PER_PERSON', 'TOTAL_PACKAGE']).default('PER_PERSON'),
    description: z.string().optional().default(''),
    price: z.coerce.number().min(0, 'Price must be a positive number'),
    currency: z
        .string()
        .min(1, 'Currency is required')
        .default('USD - Us Dollar'),

    images: z.array(
        z
            .object({
                imageId: z.string(),
            })
            .default([])
    ),
});

