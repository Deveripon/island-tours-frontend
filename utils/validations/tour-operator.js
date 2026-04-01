// Tour operator validation schema
import * as z from 'zod';
export const tourOperatorSchema = z.object({
    name: z.string().optional(),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    links: z.string().optional(),
    photo: z.any().optional(),
});

