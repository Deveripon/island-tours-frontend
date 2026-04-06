'use client';
import { getSingleAffiliateTripBySlug } from '@/app/_actions/trips/affiliateTripsAction';
import { notFound, useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TripDetailSkeliton from '../(frontend)/trips/[slug]/components/skeliton/trip-details-skeliton';
import { TripContext } from '../context/trip-context';
import { DummySingleTrip } from '../data/data';
import { generateUniqueUserId } from '../utils';

// Fixed pricing calculation function with pickup support
// Enhanced pricing calculation function with tier and pickup support
const calculatePricing = (
    tripData,
    guests,
    selectedAddons = [],
    selectedAdditionals = [],
    selectedPickup = null
) => {
    if (!tripData?.pricingConfig) {
        return {
            total: 0,
            deposit: 0,
            unitPrice: 0,
            basePrice: 0,
            discountedPrice: 0,
            breakdown: null,
        };
    }

    const config = tripData.pricingConfig;
    const {
        ageCategoryPricing,
        affiliateCommission,
        taxPercentage = 0,
        serviceCharge = 0,
        pricingModel = 'PER_PERSON',
    } = config;

    const totalGuests = guests.adults + guests.children;
    const totalPersons = totalGuests + guests.infants;

    // 1. Determine base price per person based on tiers or standard pricing
    let adultPrice = ageCategoryPricing.adultsPrice || 0;
    let childPrice = ageCategoryPricing.childrensPrice || 0;
    let currentTier = null;

    // If there are tiers, find the applicable one
    if (tripData.pricingTiers && tripData.pricingTiers.length > 0) {
        const eligibleTiers = tripData.pricingTiers.filter(
            tier =>
                totalGuests >= (tier.groupSizeMin || 0) &&
                (tier.groupSizeMax === null || totalGuests <= tier.groupSizeMax)
        );

        if (eligibleTiers.length > 0) {
            // Pick the tier with the lowest basePrice (usually the most specific or best deal)
            // or simply the first one that matches the group size
            currentTier = eligibleTiers.sort(
                (a, b) => a.basePrice - b.basePrice
            )[0];
            adultPrice = currentTier.basePrice;
            // Children often get a proportional discount if not explicitly set in tier?
            // For now, if tiers are used, we assume basePrice applies to adults,
            // and children either use tier price or their own ratio.
            // Let's assume childPrice from config if not in tier, or same as adult if tiers are group-based.
            childPrice = currentTier.childPrice || childPrice;
        }
    }

    const infantPrice = ageCategoryPricing.infantsPrice || 0;

    // 2. Calculate base cost
    const baseCost =
        guests.adults * adultPrice +
        guests.children * childPrice +
        guests.infants * infantPrice;

    // 3. Add selected addons cost
    const addonsCost = selectedAddons.reduce((total, addon) => {
        const quantity = addon.quantity || 1;
        if (addon.pricingModel === 'PER_PERSON') {
            return total + (addon.price || 0) * totalPersons;
        }
        return total + (addon.price || 0) * quantity;
    }, 0);

    // 4. Add selected additionals cost
    const additionalsCost = selectedAdditionals.reduce((total, additional) => {
        return (
            total + (additional.priceImpact || 0) * (additional.quantity || 1)
        );
    }, 0);

    // 5. Calculate pickup cost (per person)
    const pickupCost = selectedPickup
        ? (selectedPickup.price || 0) * totalPersons
        : 0;

    // Subtotal before taxes and charges
    const subtotal = baseCost + addonsCost + additionalsCost + pickupCost;

    // 6. Calculate tax and service charge
    // If "included" is true in config, it means we should CALCULATE it and ADD it
    // (In this system's logic, "included" seems to mean "enabled for calculation")
    const taxAmount = config.includedTax ? (subtotal * taxPercentage) / 100 : 0;
    const serviceChargeAmount = config.includedServiceCharge
        ? serviceCharge // Fixed amount as per existing code
        : 0;

    // Total amount
    const total = subtotal + taxAmount + serviceChargeAmount;

    // 7. Calculate deposit (based on commission)
    // NOTE: Additionals and Pickups do NOT affect deposit calculation as per requirement
    let commissionPerAdult = 0;
    let commissionPerChild = 0;

    if (affiliateCommission?.commissionType === 'PERCENTAGE') {
        commissionPerAdult =
            (adultPrice * affiliateCommission?.commissionValue) / 100;
        commissionPerChild =
            (childPrice * affiliateCommission?.commissionValue) / 100;
    } else if (affiliateCommission?.commissionType === 'FIXED') {
        commissionPerAdult = affiliateCommission?.commissionValue;
        commissionPerChild = affiliateCommission?.commissionValue;
    }

    const totalAdultCommission = commissionPerAdult * guests.adults;
    const totalChildCommission = commissionPerChild * guests.children;
    const totalCommission = totalAdultCommission + totalChildCommission;

    // Deposit = total commission + fixed service charge
    const deposit = totalCommission + serviceChargeAmount;

    const breakdown = {
        baseCost,
        addonsCost,
        additionalsCost,
        selectedAdditionals,
        pickupCost,
        subtotal,
        taxAmount,
        serviceChargeAmount,
        total,
        deposit,
        commissionPerAdult,
        commissionPerChild,
        totalAdultCommission,
        totalChildCommission,
        totalCommission,
        totalPersons,
        selectedPickup,
        unitPrice: adultPrice,
    };

    return {
        total,
        deposit,
        breakdown,
        unitPrice: adultPrice,
        basePrice: baseCost,
        discountedPrice: subtotal, // For now, discounted is same as subtotal if no promos
        currentTier,
    };
};

// Helper function to get or create persistent user ID
const getPersistentUserId = () => {
    if (typeof window === 'undefined') return null;

    // Use session storage instead of localStorage to avoid persistence issues
    const STORAGE_KEY = 'trip_user_id';
    const newUserId = generateUniqueUserId();

    try {
        const existingUserId = sessionStorage.getItem(STORAGE_KEY);
        if (existingUserId) {
            return existingUserId;
        }
        sessionStorage.setItem(STORAGE_KEY, newUserId);
        return newUserId;
    } catch (error) {
        return newUserId;
    }
};

export const TripProvider = ({ children }) => {
    const { slug } = useParams();

    // Core state
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Booking state
    const [selectedDate, setSelectedDate] = useState(null);
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [selectedAdditionals, setSelectedAdditionals] = useState([]);
    const [selectedPickup, setSelectedPickup] = useState(null); // New pickup state
    const [appliedPromoCodes, setAppliedPromoCodes] = useState([]);

    // Initialize user ID
    useEffect(() => {
        const persistentUserId = getPersistentUserId();
        setUserId(persistentUserId);
    }, []);

    // Fetch trip data
    const fetchTripData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (!slug) return;

            const res = await getSingleAffiliateTripBySlug(slug);

            if (res?.success && res?.trip?.data) {
                setTripData(res.trip.data);
            } else {
                notFound();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchTripData();
    }, [fetchTripData]);

    // Pricing calculations with proper debugging including pickup
    const pricing = useMemo(() => {
        const result = calculatePricing(
            tripData,
            guests,
            selectedAddons,
            selectedAdditionals,
            selectedPickup
        );
        return result;
    }, [tripData, guests, selectedAddons, selectedAdditionals, selectedPickup]);

    // Update functions
    const updateGuests = useCallback(newGuests => {
        setGuests(prev => ({ ...prev, ...newGuests }));
    }, []);

    const updateSelectedDate = useCallback(date => {
        setSelectedDate(date);
    }, []);

    const updateSelectedAddons = useCallback(addons => {
        setSelectedAddons(addons);
    }, []);

    const updateSelectedAdditionals = useCallback(additionals => {
        setSelectedAdditionals(additionals);
    }, []);

    // New pickup update function
    const updateSelectedPickup = useCallback(pickup => {
        setSelectedPickup(pickup);
    }, []);

    const updateAppliedPromoCodes = useCallback(codes => {
        setAppliedPromoCodes(codes);
    }, []);

    // Utility functions
    const getAvailableOptions = useCallback(
        type => {
            return tripData?.availableOptions?.[type] || [];
        },
        [tripData?.availableOptions]
    );

    const getAvailableAdditionals = useCallback(() => {
        return tripData?.additionals || [];
    }, [tripData?.additionals]);

    // New pickup utility functions
    const getAvailablePickups = useCallback(() => {
        return tripData?.pickups || [];
    }, [tripData?.pickups]);

    const getSelectedPickupById = useCallback(
        pickupId => {
            if (!pickupId || !tripData?.pickups) return null;
            return (
                tripData.pickups.find(pickup => pickup.id === pickupId) || null
            );
        },
        [tripData?.pickups]
    );

    const isPickupSelected = useCallback(
        pickupId => {
            return selectedPickup?.id === pickupId;
        },
        [selectedPickup]
    );

    // Helper function to add/remove additionals (legacy - now handled by component)
    const toggleAdditional = useCallback(additional => {
        setSelectedAdditionals(prev => {
            const existingIndex = prev.findIndex(
                item => item.id === additional.id
            );

            if (existingIndex >= 0) {
                // Remove if exists
                return prev.filter(item => item.id !== additional.id);
            } else {
                // Add with default quantity 1
                return [...prev, { ...additional, quantity: 1 }];
            }
        });
    }, []);

    // Helper function to update additional quantity (legacy - now handled by component)
    const updateAdditionalQuantity = useCallback((additionalId, quantity) => {
        setSelectedAdditionals(
            prev =>
                prev
                    .map(item =>
                        item.id === additionalId
                            ? { ...item, quantity: Math.max(0, quantity) }
                            : item
                    )
                    .filter(item => item.quantity > 0) // Remove items with 0 quantity
        );
    }, []);

    // Helper function to check if additional is selected
    const isAdditionalSelected = useCallback(
        additionalId => {
            return selectedAdditionals.some(item => item.id === additionalId);
        },
        [selectedAdditionals]
    );

    // Helper function to get selected additional quantity
    const getAdditionalQuantity = useCallback(
        additionalId => {
            const item = selectedAdditionals.find(
                item => item.id === additionalId
            );
            return item ? item.quantity : 0;
        },
        [selectedAdditionals]
    );

    // Helper functions for addons (similar to additionals for consistency)
    const getAvailableAddons = useCallback(() => {
        return tripData?.addons || [];
    }, [tripData?.addons]);

    const toggleAddon = useCallback(addon => {
        setSelectedAddons(prev => {
            const existingIndex = prev.findIndex(item => item.id === addon.id);

            if (existingIndex >= 0) {
                return prev.filter(item => item.id !== addon.id);
            } else {
                return [...prev, { ...addon, quantity: 1 }];
            }
        });
    }, []);

    const updateAddonQuantity = useCallback((addonId, quantity) => {
        setSelectedAddons(prev =>
            prev
                .map(item =>
                    item.id === addonId
                        ? { ...item, quantity: Math.max(0, quantity) }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    }, []);

    const isAddonSelected = useCallback(
        addonId => {
            return selectedAddons.some(item => item.id === addonId);
        },
        [selectedAddons]
    );

    const getAddonQuantity = useCallback(
        addonId => {
            const item = selectedAddons.find(item => item.id === addonId);
            return item ? item.quantity : 0;
        },
        [selectedAddons]
    );

    // Context value
    const contextValue = useMemo(
        () => ({
            // Trip data
            tripData,
            loading,
            error,
            userId,

            // Booking state
            selectedDate,
            guests,
            selectedAddons,
            selectedAdditionals,
            selectedPickup, // New pickup state
            appliedPromoCodes,

            // Update functions
            updateGuests,
            updateSelectedDate,
            updateSelectedAddons,
            updateSelectedAdditionals,
            updateSelectedPickup, // New pickup update function
            updateAppliedPromoCodes,

            // Pricing
            pricing,

            // Utility functions
            getAvailableOptions,
            getAvailableAdditionals,
            getAvailableAddons,
            getAvailablePickups, // New pickup utility functions
            getSelectedPickupById,
            isPickupSelected,

            // Additionals management (legacy functions)
            toggleAdditional,
            updateAdditionalQuantity,
            isAdditionalSelected,
            getAdditionalQuantity,

            // Addons management
            toggleAddon,
            updateAddonQuantity,
            isAddonSelected,
            getAddonQuantity,

            // Trip details
            originalItinerary: tripData?.itineraryDays || [],
        }),
        [
            tripData,
            loading,
            error,
            userId,
            selectedDate,
            guests,
            selectedAddons,
            selectedAdditionals,
            selectedPickup, // Add to dependencies
            appliedPromoCodes,
            updateGuests,
            updateSelectedDate,
            updateSelectedAddons,
            updateSelectedAdditionals,
            updateSelectedPickup, // Add to dependencies
            updateAppliedPromoCodes,
            pricing,
            getAvailableOptions,
            getAvailableAdditionals,
            getAvailableAddons,
            getAvailablePickups, // Add to dependencies
            getSelectedPickupById,
            isPickupSelected,
            toggleAdditional,
            updateAdditionalQuantity,
            isAdditionalSelected,
            getAdditionalQuantity,
            toggleAddon,
            updateAddonQuantity,
            isAddonSelected,
            getAddonQuantity,
        ]
    );

    if (!userId || loading) {
        return <TripDetailSkeliton />;
    }

    if (error) {
        throw error;
    }

    return <TripContext value={contextValue}>{children}</TripContext>;
};

