import { useCallback, useMemo } from 'react';
import { getModifiedItineraryWithAlternatives } from '../utils/iternerary-utils';

export const useAlternativesManager = (
    tripData,
    appliedAlternatives,
    pendingAlternatives,
    dispatchApplied,
    dispatchPending,
    setCurrentlySelectedAlternative,
    saveToRedis
) => {
    // Handle alternative selection
    const handleSelectAlternative = useCallback(
        (type, dayId, optionData) => {
            const dayData = tripData?.itineraryDays?.find(day => day.id === dayId);

            dispatchApplied({
                type: 'REMOVE_ALTERNATIVE',
                payload: { type, dayId } });

            setCurrentlySelectedAlternative({
                optionData,
                dayData,
                type,
                dayId });

            dispatchPending({
                type: 'SELECT_ALTERNATIVE',
                payload: { type, dayId, optionData } });

            saveToRedis({
                lastAction: 'select_alternative',
                lastActionTime: new Date().toISOString() });
        },
        [tripData?.itineraryDays, dispatchApplied, dispatchPending, setCurrentlySelectedAlternative, saveToRedis]
    );

    // Handle alternative removal
    const handleRemoveAlternative = useCallback(
        (type, dayId) => {
            setCurrentlySelectedAlternative(null);

            dispatchApplied({
                type: 'REMOVE_ALTERNATIVE',
                payload: { type, dayId } });

            dispatchPending({
                type: 'REMOVE_ALTERNATIVE',
                payload: { type, dayId } });

            saveToRedis({
                lastAction: 'remove_alternative',
                lastActionTime: new Date().toISOString() });
        },
        [dispatchApplied, dispatchPending, setCurrentlySelectedAlternative, saveToRedis]
    );

    // Apply pending changes
    const applyPendingChanges = useCallback(() => {
        dispatchApplied({
            type: 'APPLY_PENDING',
            payload: { pendingAlternatives } });

        setCurrentlySelectedAlternative(null);
    }, [pendingAlternatives, dispatchApplied, setCurrentlySelectedAlternative]);

    // Clear all alternatives
    const clearAllAlternatives = useCallback(() => {
        dispatchApplied({ type: 'CLEAR_ALL' });
        dispatchPending({ type: 'CLEAR_ALL' });
        setCurrentlySelectedAlternative(null);
    }, [dispatchApplied, dispatchPending, setCurrentlySelectedAlternative]);

    // Modified itinerary with applied alternatives
    const modifiedItinerary = useMemo(() => {
        return getModifiedItineraryWithAlternatives(tripData?.itineraryDays, appliedAlternatives);
    }, [tripData?.itineraryDays, appliedAlternatives]);

    return {
        handleSelectAlternative,
        handleRemoveAlternative,
        applyPendingChanges,
        clearAllAlternatives,
        modifiedItinerary,
    };
};

