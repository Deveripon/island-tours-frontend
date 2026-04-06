import { useCallback, useMemo } from 'react';
import {
    calculateCompletePricing,
    calculatePreviewAlternativesPricing,
    calculateSingleAlternativePrice,
} from '../utils/pricing-calculations';

export const usePricingCalculations = (
    tripData,
    bookingState,
    appliedAlternatives,
    pendingAlternatives,
    currentlySelectedAlternative,
    selectedAddons = []
) => {
    // Main pricing calculation
    const pricing = useMemo(() => {
        const result = calculateCompletePricing(
            tripData,
            tripData?.pricingTiers,
            tripData?.pricingConfig,
            bookingState.guests,
            bookingState.selectedDate,
            bookingState.appliedPromoCodes,
            appliedAlternatives,
            selectedAddons
        );

        return result;
    }, [tripData, bookingState, appliedAlternatives, selectedAddons]);

    // Preview alternative price
    const previewAlternativesPrice = useMemo(() => {
        const totalGuests =
            bookingState.guests.adults + bookingState.guests.children;
        return calculatePreviewAlternativesPricing(
            pendingAlternatives,
            totalGuests,
            tripData?.itineraryDays
        );
    }, [pendingAlternatives, bookingState.guests, tripData?.itineraryDays]);

    // calculate price for currently selected addons
    const addonsTotalPrice = useMemo(() => {
        if (!selectedAddons || selectedAddons.length === 0) return 0;

        const totalGuests =
            bookingState.guests.adults + bookingState.guests.children;

        return selectedAddons.reduce((total, addon) => {
            if (addon.pricingModel === 'PER_PERSON') {
                return total + addon.price * totalGuests;
            } else {
                return total + addon.price;
            }
        }, 0);
    }, [selectedAddons, bookingState.guests]);

    // Calculate price for currently selected alternative
    const thisAlternativePrice = useMemo(() => {
        if (!currentlySelectedAlternative) return 0;

        const totalGuests =
            bookingState.guests.adults + bookingState.guests.children;
        return calculateSingleAlternativePrice(
            currentlySelectedAlternative.optionData,
            totalGuests,
            currentlySelectedAlternative.dayData,
            currentlySelectedAlternative.type
        );
    }, [currentlySelectedAlternative, bookingState.guests]);

    // Utility function to get price for a specific alternative
    const getAlternativePrice = useCallback(
        (optionData, dayId, type) => {
            const totalGuests =
                bookingState.guests.adults + bookingState.guests.children;
            const dayData = tripData?.itineraryDays?.find(
                day => day.id === dayId
            );
            if (!dayData) return 0;

            return calculateSingleAlternativePrice(
                optionData,
                totalGuests,
                dayData,
                type
            );
        },
        [bookingState.guests, tripData?.itineraryDays]
    );

    return {
        pricing,
        previewAlternativesPrice,
        thisAlternativePrice,
        getAlternativePrice,
        selectedAddonsCount: selectedAddons?.length || 0,
    };
};

