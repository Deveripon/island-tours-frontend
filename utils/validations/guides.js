import { z } from 'zod';

export const certificationSchema = z.object({
    certification_name: z.string().min(1, 'Certification name is required'),
    certification_issuer: z.string().min(1, 'Issuer name is required'),
    certification_year: z.coerce
        .number()
        .min(1, 'Certification year is required')
        .refine(year => year >= 1900, {
            message: 'Certification year must be after 1900',
        })
        .refine(year => year <= new Date().getFullYear(), {
            message: 'Certification year cannot be in the future',
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
        .min(1, 'At least one image is required')
        .default([]),
});

export const guideFormSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    gender: z.string().min(1, 'Gender is Required').default(''),
    age: z.coerce
        .number()
        .min(1, 'Age is required')
        .refine(val => val >= 18, {
            message: 'Age must be at least 18',
        }),
    city: z.string().optional().default(''),
    country: z.string().optional().default(''),
    email: z
        .string()
        .min(1, 'email is required')
        .email({ message: 'Please enter a valid email address' })
        .default(''),
    phone: z.string().min(10, 'Phone number required').default(''),
    bio: z.string().optional().default(''),
    about: z.string().optional().default(''),
    languages: z.array(z.string()).default(['ENGLISH']),
    skills: z.array(z.string()).optional().default([]),
    years_of_experience: z.coerce.number().optional(), //.min(0),
    specializations: z.array(z.string()).optional().default([]),
    image: z.any().refine(
        image => {
            // Accept cloud image objects with URL
            if (image && typeof image === 'object' && image.url) return true;
            // Accept File objects (during upload)
            if (image instanceof File) return true;
            return false;
        },
        {
            message: 'Photo is Required',
        }
    ),
    facebook: z.string().optional().default('#'), //url("Must be a valid URL"),
    instagram: z.string().optional().default('#'), //url("Must be a valid URL"),
    certifications: z.array(certificationSchema).default([]),
});

