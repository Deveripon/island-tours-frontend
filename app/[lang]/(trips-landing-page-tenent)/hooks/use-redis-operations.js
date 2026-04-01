// Enhanced useRedisOperations hook with final booking data protection
import { useCallback, useRef, useState } from 'react';
import {
    getDataFromRedis,
    getDataSizeInfo,
    hasDataInRedis,
    removeDataFromRedis,
    setDataToRedis,
    updateDataInRedis,
} from '../utils/trip-redis';

export const useRedisOperations = (
    userId,
    tripId,
    bookingState,
    appliedAlternatives,
    selectedAddons
) => {
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [lastSavedState, setLastSavedState] = useState(null);
    const [hasFinalBookingData, setHasFinalBookingData] = useState(false);
    const saveTimeoutRef = useRef(null);

    // Save data to Redis with debouncing and final data preservation
    const saveToRedis = useCallback(
        async (data = {}) => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }

            saveTimeoutRef.current = setTimeout(async () => {
                try {
                    // Get existing data first to preserve final booking data
                    const existingData = await getDataFromRedis(userId);

                    // Prepare the data to save
                    const dataToSave = {
                        tripId,
                        userId,
                        selectedDate: bookingState.selectedDate,
                        guests: bookingState.guests,
                        appliedPromoCodes: bookingState.appliedPromoCodes,
                        appliedAlternatives,
                        selectedAddons: selectedAddons,
                        timestamp: new Date().toISOString(),
                        ...data,
                    };

                    // Preserve final booking data and booking status if they exist
                    if (existingData && existingData.finalBookingData) {
                        dataToSave.finalBookingData =
                            existingData.finalBookingData;
                        dataToSave.bookingStatus = existingData.bookingStatus;
                    }

                    const result = await setDataToRedis(userId, dataToSave);

                    if (result.success) {
                        if (result.compressed) {
                        }
                    } else {
                    }
                } catch (error) {}
            }, 500);
        },
        [userId, tripId, bookingState, appliedAlternatives, selectedAddons]
    );

    // Save final booking data to Redis (immediate save without debouncing)
    const saveFinalBookingData = useCallback(
        async finalBookingData => {
            try {
                // Clear any pending debounced saves to prevent overwriting
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }

                const result = await updateDataInRedis(userId, {
                    tripId,
                    finalBookingData,
                    selectedAddons: selectedAddons,
                    userId,
                    bookingStatus: 'form_filling',
                    finalBookingTimestamp: new Date().toISOString() });

                if (result.success) {
                    setHasFinalBookingData(true);

                    // Log compression stats if available
                    if (result.compressed) {
                    }

                    return {
                        success: true,
                        userId,
                        tripId,
                        finalBookingData,
                        bookingStatus: 'form_filling',
                        timestamp: result.timestamp,
                        compressed: result.compressed,
                    };
                } else {
                    return { success: false, error: result.error };
                }
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [userId, tripId, selectedAddons]
    );

    // Get final booking data from Redis
    const getFinalBookingData = useCallback(async () => {
        try {
            const savedData = await getDataFromRedis(userId);
            if (
                savedData &&
                savedData.tripId === tripId &&
                savedData.finalBookingData
            ) {
                setHasFinalBookingData(true);
                return {
                    success: true,
                    data: {
                        ...savedData.finalBookingData,
                        tripId,
                    },
                    bookingStatus: savedData.bookingStatus,
                    timestamp:
                        savedData.finalBookingTimestamp || savedData.timestamp,
                };
            } else {
                setHasFinalBookingData(false);
                return { success: false, error: 'No final booking data found' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, [userId, tripId]);

    // Load data from Redis with final data detection
    const loadFromRedis = useCallback(
        async (
            bookingStateUpdaters,
            dispatchApplied,
            dispatchPending,
            setSelectedAddons
        ) => {
            try {
                const savedData = await getDataFromRedis(userId);
                if (savedData && savedData?.selectedAddons) {
                    setSelectedAddons(savedData?.selectedAddons);
                }
                if (savedData && savedData.tripId === tripId) {
                    // Check if data is fresh enough
                    const dataAge =
                        Date.now() -
                        new Date(
                            savedData.timestamp || savedData.lastUpdated
                        ).getTime();
                    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

                    if (dataAge > maxAge) {
                        await removeDataFromRedis(userId);
                        setIsDataLoaded(true);
                        return;
                    }

                    // Check if final booking data exists
                    if (savedData.finalBookingData) {
                        setHasFinalBookingData(true);
                    }

                    // Restore booking state
                    if (savedData.selectedDate)
                        bookingStateUpdaters.setSelectedDate(
                            savedData.selectedDate
                        );
                    if (savedData.guests)
                        bookingStateUpdaters.setGuests(savedData.guests);
                    if (savedData.appliedPromoCodes)
                        bookingStateUpdaters.setAppliedPromoCodes(
                            savedData.appliedPromoCodes
                        );

                    // Restore applied alternatives
                    if (savedData.appliedAlternatives) {
                        dispatchApplied({
                            type: 'LOAD_FROM_REDIS',
                            payload: savedData.appliedAlternatives });
                        dispatchPending({
                            type: 'LOAD_FROM_REDIS',
                            payload: savedData.appliedAlternatives });
                    }
                } else if (savedData) {
                    await removeDataFromRedis(userId);
                }
            } catch (error) {
            } finally {
                setIsDataLoaded(true);
            }
        },
        [userId, tripId]
    );

    // Clear user trip data
    const clearUserTripData = useCallback(async () => {
        try {
            await removeDataFromRedis(userId);
            setHasFinalBookingData(false);
        } catch (error) {}
    }, [userId]);

    // Check if user has saved data
    const checkSavedData = useCallback(async () => {
        try {
            return await hasDataInRedis(userId);
        } catch (error) {
            return false;
        }
    }, [userId]);

    // Auto-save functionality with final data protection
    const autoSave = useCallback(() => {
        // Don't auto-save if we have final booking data to prevent overwrites
        if (hasFinalBookingData) {
            return;
        }

        const currentState = {
            selectedDate: bookingState.selectedDate,
            guests: bookingState.guests,
            appliedPromoCodes: bookingState.appliedPromoCodes,
            appliedAlternatives,
        };

        const currentStateStr = JSON.stringify(currentState);
        if (lastSavedState !== currentStateStr) {
            setLastSavedState(currentStateStr);
            saveToRedis();
        }
    }, [
        bookingState,
        appliedAlternatives,
        lastSavedState,
        saveToRedis,
        hasFinalBookingData,
    ]);

    // Manual save (bypasses final data protection)
    const manualSave = useCallback(
        async (data = {}) => {
            try {
                const result = await setDataToRedis(userId, {
                    tripId,
                    selectedDate: bookingState.selectedDate,
                    guests: bookingState.guests,
                    appliedPromoCodes: bookingState.appliedPromoCodes,
                    appliedAlternatives,
                    timestamp: new Date().toISOString(),
                    ...data });

                if (result.success) {
                    return result;
                } else {
                    return result;
                }
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [userId, tripId, bookingState, appliedAlternatives]
    );

    // Get data size information
    const getStorageInfo = useCallback(async () => {
        try {
            const sizeInfo = await getDataSizeInfo(userId);
            return sizeInfo;
        } catch (error) {
            return { exists: false, error: error.message };
        }
    }, [userId]);

    // Update booking status
    const updateBookingStatus = useCallback(
        async newStatus => {
            try {
                const result = await updateDataInRedis(userId, {
                    bookingStatus: newStatus,
                    statusUpdatedAt: new Date().toISOString() });

                if (result.success) {
                    return result;
                } else {
                    return result;
                }
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        [userId]
    );

    // Cleanup timeout on unmount
    const cleanup = useCallback(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
    }, []);

    return {
        isDataLoaded,
        hasFinalBookingData,
        saveToRedis,
        loadFromRedis,
        clearUserTripData,
        checkSavedData,
        autoSave,
        manualSave,
        cleanup,
        saveFinalBookingData,
        getFinalBookingData,
        getStorageInfo,
        updateBookingStatus,
    };
};

