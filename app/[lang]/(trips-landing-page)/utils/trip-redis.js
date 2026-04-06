import { Redis } from '@upstash/redis';
import pako from 'pako';

// Pre-Booking Data store into redis with compression
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN });

/**
 * Compress data using gzip
 */
function compressData(data) {
    try {
        const jsonString = JSON.stringify(data);
        const compressed = pako.gzip(jsonString);
        const base64 = Buffer.from(compressed).toString('base64');
        return {
            success: true,
            data: base64,
            originalSize: jsonString.length,
            compressedSize: base64.length,
            compressionRatio: (jsonString.length / base64.length).toFixed(2),
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Decompress data
 */
function decompressData(compressedData) {
    try {
        const compressed = Buffer.from(compressedData, 'base64');
        const decompressed = pako.ungzip(compressed, { to: 'string' });
        const data = JSON.parse(decompressed);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Check data size and decide whether to compress
 */
function shouldCompress(data) {
    const jsonString = JSON.stringify(data);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInKB = sizeInBytes / 1024;

    // Compress if data is larger than 10KB
    return sizeInKB > 10;
}

/**
 * Store data to redis with compression and size optimization
 */
export async function setDataToRedis(userId, data) {
    try {
        const key = `tripdata:user:${userId}`;

        // Add metadata for better tracking
        const dataWithMetadata = {
            ...data,
            lastUpdated: new Date().toISOString(),
            version: Date.now(),
        };

        let finalData;
        let isCompressed = false;
        let compressionStats = null;

        if (shouldCompress(dataWithMetadata)) {
            const compressionResult = compressData(dataWithMetadata);

            if (compressionResult.success) {
                finalData = {
                    __compressed: true,
                    __compressionStats: {
                        originalSize: compressionResult.originalSize,
                        compressedSize: compressionResult.compressedSize,
                        ratio: compressionResult.compressionRatio,
                    },
                    data: compressionResult.data,
                };
                isCompressed = true;
                compressionStats = compressionResult;
            } else {
                // Fallback to uncompressed if compression fails
                finalData = dataWithMetadata;
            }
        } else {
            finalData = dataWithMetadata;
        }

        // Check final size before storing
        const finalSizeKB = new Blob([JSON.stringify(finalData)]).size / 1024;
        if (finalSizeKB > 1024) {
            // 1MB limit
            console.warn(
                `⚠️ [REDIS STORE] Data size (${finalSizeKB.toFixed(
                    2
                )}KB) exceeds recommended limit`
            );

            // Try to reduce data by removing non-essential fields
            const essentialData = {
                tripId: dataWithMetadata.tripId,
                selectedDate: dataWithMetadata.selectedDate,
                guests: dataWithMetadata.guests,
                appliedPromoCodes: dataWithMetadata.appliedPromoCodes,
                appliedAlternatives: dataWithMetadata.appliedAlternatives,
                finalBookingData: dataWithMetadata.finalBookingData
                    ? {
                          // Keep only essential booking fields
                          personalInfo:
                              dataWithMetadata.finalBookingData.personalInfo,
                          contactInfo:
                              dataWithMetadata.finalBookingData.contactInfo,
                          preferences:
                              dataWithMetadata.finalBookingData.preferences,
                      }
                    : undefined,
                lastUpdated: dataWithMetadata.lastUpdated,
                version: dataWithMetadata.version,
            };

            if (shouldCompress(essentialData)) {
                const compressionResult = compressData(essentialData);
                if (compressionResult.success) {
                    finalData = {
                        __compressed: true,
                        __reduced: true,
                        __compressionStats: {
                            originalSize: compressionResult.originalSize,
                            compressedSize: compressionResult.compressedSize,
                            ratio: compressionResult.compressionRatio,
                        },
                        data: compressionResult.data,
                    };
                }
            } else {
                finalData = { ...essentialData, __reduced: true };
            }
        }

        // Set with TTL (7 days = 604800 seconds)
        await redis.setex(key, 604800, finalData);

        if (compressionStats) {
        }

        return {
            success: true,
            timestamp: dataWithMetadata.lastUpdated,
            compressed: isCompressed,
            compressionStats,
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get data from redis with decompression
 */
export async function getDataFromRedis(userId) {
    try {
        const key = `tripdata:user:${userId}`;
        const rawData = await redis.get(key);

        if (rawData) {
            let data;

            if (rawData.__compressed) {
                const decompressionResult = decompressData(rawData.data);

                if (decompressionResult.success) {
                    data = decompressionResult.data;
                } else {
                    return null;
                }
            } else {
                data = rawData;
            }

            return data;
        }

        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Remove data from redis
 */
export async function removeDataFromRedis(userId) {
    try {
        const key = `tripdata:user:${userId}`;
        const result = await redis.del(key);

        if (result === 1) {
            return { success: true };
        } else {
            return { success: true, message: 'No data found' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Check if data exists in redis
 */
export async function hasDataInRedis(userId) {
    try {
        const key = `tripdata:user:${userId}`;
        const exists = await redis.exists(key);
        return exists === 1;
    } catch (error) {
        return false;
    }
}

/**
 * Update specific fields in existing data with compression support
 */
export async function updateDataInRedis(userId, updates) {
    try {
        // Get existing data first
        const existingData = await getDataFromRedis(userId);

        if (!existingData) {
            return await setDataToRedis(userId, updates);
        }

        // Merge updates with existing data
        const mergedData = {
            ...existingData,
            ...updates,
            lastUpdated: new Date().toISOString(),
            version: Date.now(),
        };

        // Use setDataToRedis for compression logic
        return await setDataToRedis(userId, mergedData);
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get data size information
 */
export async function getDataSizeInfo(userId) {
    try {
        const key = `tripdata:user:${userId}`;
        const rawData = await redis.get(key);

        if (!rawData) {
            return { exists: false };
        }

        const rawSize = new Blob([JSON.stringify(rawData)]).size;

        return {
            exists: true,
            rawSizeBytes: rawSize,
            rawSizeKB: (rawSize / 1024).toFixed(2),
            isCompressed: !!rawData.__compressed,
            compressionStats: rawData.__compressionStats || null,
            isReduced: !!rawData.__reduced,
        };
    } catch (error) {
        return { exists: false, error: error.message };
    }
}

/**
 * Get all user trip data keys (for admin/debugging)
 */
export async function getAllUserTripKeys() {
    try {
        return await redis.keys('tripdata:user:*');
    } catch (error) {
        return [];
    }
}

/**
 * Clean up expired or old data (manual cleanup if needed)
 */
export async function cleanupOldData(olderThanDays = 7) {
    try {
        const keys = await getAllUserTripKeys();
        const cutoffTime = new Date(
            Date.now() - olderThanDays * 24 * 60 * 60 * 1000
        );
        let cleanedCount = 0;

        for (const key of keys) {
            const data = await getDataFromRedis(key.split(':')[2]); // Extract userId from key
            if (data && data.lastUpdated) {
                const dataTime = new Date(data.lastUpdated);
                if (dataTime < cutoffTime) {
                    await redis.del(key);
                    cleanedCount++;
                }
            }
        }

        return { success: true, cleanedCount };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

