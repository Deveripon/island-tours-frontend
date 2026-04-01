import { z } from 'zod';

export const couponSchema = z.object({
    description: z.string().min(1, 'Coupon description is required'),
    code: z.string().min(1, 'Coupon code is required'),
    discountType: z.string().default('PERCENTAGE'),
    discountValue: z.number().default(0),
    validFrom: z.string().min(1, 'Coupon valid start date is required'),
    validUntil: z.string().min(1, 'Coupon valid end date is required'),
    minimumAmount: z.number().default(0),
    applicableTripIds: z.array(z.string()).default([]),
    excludedTripIds: z.array(z.string()).default([]),
    maxUsage: z.number().default(1),
    oncePerCustomer: z.boolean().default(false),
    status: z.boolean().default(false),
});

