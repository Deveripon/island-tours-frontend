const { z } = require('zod');

export const bookingFormSchema = z.object({
    contactInfo: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Valid email is required'),
        mobile: z.object({
            countryCode: z.string().min(1, 'Country code is required'),
            number: z.string().min(10, 'Valid mobile number is required') }),
        city: z.string().optional().default(''),
        address: z.string().optional().default('') }),
    specialRequests: z.string().optional() });

