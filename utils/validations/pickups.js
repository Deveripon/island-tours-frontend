import { z } from 'zod';

export const pickups = z.object({
    locationName: z
        .string()
        .min(1, 'Pickup location name is required')
        .default(''),
    fullAddress: z.string().optional().default(''),
    tripId: z.string().min(1, 'Trip is required').default(''),
    price: z.number().default(0),
    meetingInstruction: z.string().optional().default(''),
});

