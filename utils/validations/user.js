import { z } from 'zod';

export const userSchema = z.object({
    name: z.string().trim().optional().default(''),

    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Please enter a valid email address')
        .max(255, 'Email must not exceed 255 characters')
        .toLowerCase(),
    role: z.string().trim().optional(),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must not exceed 128 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/,
            'Password must contain at least one lowercase letter, one uppercase letter, and one number'
        )
        .or(z.literal('')),
});

