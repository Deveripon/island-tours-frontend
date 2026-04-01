'use server';

import { tripGenerationSchema } from '@/utils/schemas/trip-generation-schema-ai';
import { AI_TRIP_GENERATION_SYSTEM_PROMPT } from '@/utils/system-prompts/ai-trip-generation-system-prompt';
import { createGroq } from '@ai-sdk/groq';
import { generateObject } from 'ai';

const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
});

/**
 * Generate a detailed trip package using AI based on a prompt
 * @param {string} prompt - The user's input prompt for trip generation
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 * 
 * Follows Vercel React Best Practices:
 * - Rule 7.8: Early return from functions
 * - Rule 1.3: Start promises early, await late (though this is a single major async call)
 * - Input validation
 */
export async function generateAffiliateTripAction(prompt) {
    // Input validation - early return if invalid (Rule 7.8)
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return {
            success: false,
            error: 'Valid prompt is required',
        };
    }

    try {
        // Start promise early (Rule 1.3)
        const generatePromise = generateObject({
            model: groq('moonshotai/kimi-k2-instruct-0905'),
            system: AI_TRIP_GENERATION_SYSTEM_PROMPT,
            prompt: `Generate a detailed trip package for: ${prompt}`,
            schema: tripGenerationSchema
        });

        const { object } = await generatePromise;

        if (!object) {
            return {
                success: false,
                error: 'AI failed to generate a valid trip object',
            };
        }

        return {
            success: true,
            data: object,
        };
    } catch (error) {
        console.error('Error in generateAffiliateTripAction:', error);
        return {
            success: false,
            error: error?.message || 'Failed to generate trip',
        };
    }
}
