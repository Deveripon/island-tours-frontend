const { z } = require('zod');

// Form validation schema
export const travellerInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dateOfBirth: z.object({
        day: z.string().min(1, 'Day is required'),
        month: z.string().min(1, 'Month is required'),
        year: z.string().min(1, 'Year is required') }),
    gender: z.string().min(1, 'Gender is required') });

export const bookingFormSchema = z.object({
    travellerInfo: z.object({
        adults: z.array(travellerInfoSchema).min(1, 'At least one adult is required'),
        children: z.array(travellerInfoSchema).optional(),
        infants: z.array(travellerInfoSchema).optional() }),
    contactInfo: z.object({
        email: z.string().email('Valid email is required'),
        mobile: z.object({
            countryCode: z.string().min(1, 'Country code is required'),
            number: z.string().min(10, 'Valid mobile number is required') }),
        city: z.string().min(1, 'City is required'),
        address: z.string().min(1, 'Address is required') }),
    specialRequests: z.string().optional(),
    addons: z.array(z.any()).optional(),
    termsAccepted: z.boolean({ message: 'Bofore procceed,you should accepted terms and policy' }) });

