'use server';

import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
});

const DRAFT_TTL = 60 * 60 * 24 * 7; // 7 days

export async function saveTripDraft(tripId, data) {
    try {
        const key = `draft:trip:${tripId}`;
        await redis.setex(key, DRAFT_TTL, data);
        return { success: true };
    } catch (error) {
        console.error('Failed to save draft:', error);
        return { success: false, error: 'Failed to save draft' };
    }
}

export async function getTripDraft(tripId) {
    try {
        const key = `draft:trip:${tripId}`;
        const data = await redis.get(key);
        return { success: true, data };
    } catch (error) {
        console.error('Failed to get draft:', error);
        return { success: false, error: 'Failed to get draft' };
    }
}

export async function discardTripDraft(tripId) {
    try {
        const key = `draft:trip:${tripId}`;
        await redis.del(key);
        return { success: true };
    } catch (error) {
        console.error('Failed to discard draft:', error);
        return { success: false, error: 'Failed to discard draft' };
    }
}
