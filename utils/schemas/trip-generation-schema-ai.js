
import { z } from 'zod';

// Simplified schema for AI generation (no File objects or complex refinements)
export const tripGenerationSchema = z.object({
    title: z.string().describe('The main title/name of the trip package'),
    shortDescription: z
        .string()
        .describe('A concise summary of the trip package (150-300 chars)'),
    fullDescription: z
        .string()
        .describe(
            'The complete, detailed description of the trip package with HTML tags'
        ),
    duration: z
        .string()
        .describe('Total duration (e.g., "10 Hours", "3 Days 2 Nights")'),

    datesAvailability: z
        .object({
            isFixedDeparture: z.boolean().default(false).describe('Is fixed departure? make it always false while generation and generate details of departure dates and times'),
            onlyUponRequest: z.boolean().default(false),
            departureDates: z
                .array(z.string())
                .describe('ISO dates YYYY-MM-DD if fixed departure'),
            departureTimes: z.array(z.string()).describe('Times HH:MM:SS'),
            daysOfTheWeek: z.array(z.string()).describe('Days e.g. ["Monday"]'),
            dateRangeStart: z
                .string()
                .nullable()
                .optional()
                .describe('Start date YYYY-MM-DD'),
            dateRangeEnd: z
                .string()
                .nullable()
                .optional()
                .describe('End date YYYY-MM-DD'),
            blackoutDates: z.array(z.string()).default([]),
        })
        .describe('Availability scheduling configuration'),

    pricingConfig: z
        .object({
            pricingModel: z
                .enum(['PER_PERSON', 'TOTAL_PACKAGE'])
                .default('PER_PERSON'),
            currency: z.string().default('USD - US Dollar'),
            includedTax: z.boolean().default(false),
            taxPercentage: z.number().default(0),
            includedServiceCharge: z.boolean().default(true),
            serviceCharge: z.number().default(0),
            ageCategoryPricing: z
                .object({
                    adults: z.string().default('Adults'),
                    adultsMinAge: z.number().default(13),
                    adultsMaxAge: z.number().default(100),
                    adultsPrice: z.number().describe('Price for adults (100-200)'),
                    maxAdults: z.number().default(10),
                    childrens: z.string().default('Children'),
                    childrensMinAge: z.number().default(4),
                    childrensMaxAge: z.number().default(12),
                    childrensPrice: z.number().describe('Price for children (less than adults)'),
                    maxChildren: z.number().default(10),
                    infants: z.string().default('Infants'),
                    infantsMinAge: z.number().default(0),
                    infantsMaxAge: z.number().default(3),
                    infantsPrice: z.number().describe('Price for infants (minimal or free)'),
                    maxInfants: z.number().default(5),
                })
                .optional(),
        })
        .describe('Pricing configuration'),

    highlights: z
        .array(z.string())
        .describe('List of main attractions (4-8 items)'),
    whatIsIncluded: z
        .array(z.string())
        .describe('List of included items/services'),
    meetingPoint: z.string().optional().describe('Meeting location address'),
    meetingTime: z.string().optional().describe('Meeting time'),

    additionals: z
        .array(
            z.object({
                name: z.string(),
                description: z.string().optional(),
                priceImpact: z.number().describe('Additional cost or discount'),
            })
        )
        .default([])
        .describe('Optional add-ons'),
});
