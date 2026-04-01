// Calculate price difference for a single alternative option
export const calculateSingleAlternativePrice = (
    optionData,
    totalGuests,
    dayData,
    type
) => {
    if (!optionData || !dayData) return 0;

    let alternativePrice = 0;
    let includedPrice = 0;

    // Special handling for meals since they can be arrays
    if (type === 'meals') {
        const includedMeals = dayData.meals || [];

        if (Array.isArray(optionData)) {
            // Alternative is an array of meals
            optionData.forEach(altMeal => {
                const mealCategory = altMeal.category || altMeal.type;
                const includedMeal = includedMeals.find(
                    meal => (meal.category || meal.type) === mealCategory
                );

                // Add alternative meal price
                if (altMeal.price) {
                    alternativePrice += altMeal.price;
                } else if (altMeal.pricePerPerson) {
                    alternativePrice += altMeal.pricePerPerson * totalGuests;
                }

                // Subtract included meal price
                if (includedMeal) {
                    if (includedMeal.price) {
                        includedPrice += includedMeal.price;
                    } else if (includedMeal.pricePerPerson) {
                        includedPrice +=
                            includedMeal.pricePerPerson * totalGuests;
                    }
                }
            });
        } else {
            // Alternative is a single meal
            const mealCategory = optionData.category || optionData.type;
            const includedMeal = includedMeals.find(
                meal => (meal.category || meal.type) === mealCategory
            );

            // Calculate alternative meal price
            if (optionData.price) {
                alternativePrice = optionData.price;
            } else if (optionData.pricePerPerson) {
                alternativePrice = optionData.pricePerPerson * totalGuests;
            }

            // Calculate included meal price
            if (includedMeal) {
                if (includedMeal.price) {
                    includedPrice = includedMeal.price;
                } else if (includedMeal.pricePerPerson) {
                    includedPrice = includedMeal.pricePerPerson * totalGuests;
                }
            }
        }

        return alternativePrice - includedPrice;
    }

    // For non-meal alternatives, calculate the alternative price first
    if (optionData.price) {
        alternativePrice = optionData.price;
    } else if (optionData.pricePerPerson) {
        alternativePrice = optionData.pricePerPerson * totalGuests;
    } else if (optionData.pricePerNight) {
        alternativePrice = optionData.pricePerNight;
    } else if (
        optionData.rooms &&
        optionData.rooms.length > 0 &&
        optionData.rooms[0].pricePerNight
    ) {
        alternativePrice = optionData.rooms[0].pricePerNight;
    }

    // Get the price of what's currently included in the itinerary
    switch (type) {
        case 'hotel':
            const includedHotel = dayData.hotel;
            if (includedHotel?.rooms && includedHotel.rooms.length > 0) {
                includedPrice = includedHotel.rooms[0].pricePerNight || 0;
            }
            break;

        case 'transportation':
            const includedTransfer = dayData.transferDetails;
            if (includedTransfer) {
                if (includedTransfer.price) {
                    includedPrice = includedTransfer.price;
                } else if (includedTransfer.pricePerPerson) {
                    includedPrice =
                        includedTransfer.pricePerPerson * totalGuests;
                }
            }
            break;

        case 'activities':
            const includedActivity = dayData.activities;
            if (includedActivity) {
                if (includedActivity.price) {
                    includedPrice = includedActivity.price;
                } else if (includedActivity.pricePerPerson) {
                    includedPrice =
                        includedActivity.pricePerPerson * totalGuests;
                }
            }
            break;

        case 'sightseeing':
            const includedSightseeing = dayData.sightseeing;
            if (includedSightseeing) {
                if (includedSightseeing.price) {
                    includedPrice = includedSightseeing.price;
                } else if (includedSightseeing.pricePerPerson) {
                    includedPrice =
                        includedSightseeing.pricePerPerson * totalGuests;
                }
            }
            break;

        default:
            includedPrice = 0;
    }

    return alternativePrice - includedPrice;
};

// Calculate preview alternatives pricing
export const calculatePreviewAlternativesPricing = (
    alternatives,
    totalGuests,
    itineraryDays
) => {
    let total = 0;

    for (const [type, selections] of Object.entries(alternatives)) {
        for (const [dayId, selectedOption] of Object.entries(selections)) {
            const dayData = itineraryDays?.find(day => day.id === dayId);
            if (dayData) {
                total += calculateSingleAlternativePrice(
                    selectedOption,
                    totalGuests,
                    dayData,
                    type
                );
            }
        }
    }

    return total;
};

// Updated pricing calculation function - only the relevant part that calls calculateSingleAlternativePrice
export const calculateAlternativesPricingInMainFunction = (
    appliedAlternatives,
    totalGuests,
    itineraryDays
) => {
    let alternativesPrice = 0;

    for (const [type, selections] of Object.entries(appliedAlternatives)) {
        for (const [dayId, selectedOption] of Object.entries(selections)) {
            // Find the corresponding day data
            const dayData = itineraryDays?.find(day => day.id === dayId);
            if (dayData) {
                alternativesPrice += calculateSingleAlternativePrice(
                    selectedOption,
                    totalGuests,
                    dayData,
                    type
                );
            }
        }
    }

    return alternativesPrice;
};

// Enhanced pricing calculation function that properly handles price increases and reductions
export const calculateCompletePricing = (
    tripData,
    pricingTiers,
    pricingConfig,
    guests,
    selectedDate,
    appliedPromoCodes,
    appliedAlternatives,
    selectedAddons = []
) => {
    if (!tripData)
        return {
            basePrice: 0,
            discounts: [],
            taxes: 0,
            serviceCharges: 0,
            total: 0,
            totalDiscount: 0,
            alternativesPrice: 0,
            alternativesSavings: 0,
            alternativesUpcharges: 0,
        };

    const totalGuests = guests.adults + guests.children;

    const addonsPrice = selectedAddons.reduce((total, addon) => {
        if (addon.pricingModel === 'PER_PERSON') {
            return total + addon.price * totalGuests;
        } else {
            return total + addon.price;
        }
    }, 0);
    // Get current tier
    const getCurrentTier = () => {
        if (!pricingTiers || pricingTiers.length === 0) {
            return null;
        }

        let eligibleTiers = pricingTiers.filter(
            tier =>
                totalGuests >= (tier.groupSizeMin || 1) &&
                totalGuests <= (tier.groupSizeMax || 999)
        );

        if (selectedDate) {
            const dateObj =
                typeof selectedDate === 'string'
                    ? new Date(selectedDate)
                    : selectedDate;

            if (isNaN(dateObj.getTime())) {
                return eligibleTiers[0] || null;
            }

            eligibleTiers = eligibleTiers.filter(tier => {
                if (tier.validFrom && tier.validUntil) {
                    const validFrom = new Date(tier.validFrom);
                    const validUntil = new Date(tier.validUntil);

                    if (
                        isNaN(validFrom.getTime()) ||
                        isNaN(validUntil.getTime())
                    ) {
                        return true;
                    }

                    return dateObj >= validFrom && dateObj <= validUntil;
                }
                return true;
            });
        }

        if (eligibleTiers.length === 0) {
            return pricingTiers[0] || null;
        }

        return eligibleTiers.sort((a, b) => a.basePrice - b.basePrice)[0];
    };

    const currentTier = getCurrentTier();
    const isPackageForPerPerson = pricingConfig?.pricingModel === 'PER_PERSON';

    // Calculate base price
    let basePrice;
    if (isPackageForPerPerson) {
        if (currentTier) {
            basePrice = currentTier.basePrice * totalGuests;
        } else if (tripData?.startingPrice) {
            basePrice = tripData.startingPrice * totalGuests;
        } else {
            basePrice = 0;
        }
    } else {
        if (currentTier) {
            basePrice = currentTier.basePrice;
        } else if (tripData?.startingPrice) {
            basePrice = tripData.startingPrice;
        } else {
            basePrice = 0;
        }
    }

    // Calculate alternatives pricing with detailed breakdown
    let alternativesPrice = 0;
    let alternativesSavings = 0;
    let alternativesUpcharges = 0;
    const alternativesBreakdown = [];

    for (const [type, selections] of Object.entries(appliedAlternatives)) {
        for (const [dayId, selectedOption] of Object.entries(selections)) {
            const dayData = tripData?.itineraryDays?.find(
                day => day.id === dayId
            );
            if (dayData) {
                const priceDifference = calculateSingleAlternativePrice(
                    selectedOption,
                    totalGuests,
                    dayData,
                    type
                );

                // Track the breakdown
                alternativesBreakdown.push({
                    type,
                    dayId,
                    option: selectedOption,
                    priceDifference: priceDifference });

                alternativesPrice += priceDifference;

                // Separate savings and upcharges for better visibility
                if (priceDifference < 0) {
                    alternativesSavings += Math.abs(priceDifference);
                } else {
                    alternativesUpcharges += priceDifference;
                }
            }
        }
    }

    // Calculate subtotal (base price + alternatives adjustments + addons price)
    const subtotal = basePrice + alternativesPrice + addonsPrice;

    let discounts = [];
    let totalDiscount = 0;

    // Convert selectedDate to Date object for discount calculations
    const usersSelectedDate = selectedDate
        ? typeof selectedDate === 'string'
            ? new Date(selectedDate)
            : selectedDate
        : null;

    // Early bird discount
    if (
        pricingConfig?.earlyBirdDiscount?.isEnabled &&
        usersSelectedDate &&
        !isNaN(usersSelectedDate.getTime())
    ) {
        const daysUntilTrip = Math.ceil(
            (usersSelectedDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilTrip >= pricingConfig.earlyBirdDiscount.daysInAdvance) {
            const discountValue = pricingConfig.earlyBirdDiscount.discountValue;
            const discount =
                pricingConfig.earlyBirdDiscount.discountType === 'PERCENTAGE'
                    ? (subtotal * discountValue) / 100
                    : discountValue;

            discounts.push({
                name: `Early Bird Discount`,
                description: `Book ${pricingConfig.earlyBirdDiscount.daysInAdvance}+ days in advance`,
                amount: discount,
                percentage:
                    pricingConfig.earlyBirdDiscount.discountType ===
                    'PERCENTAGE'
                        ? discountValue
                        : null,
                type: 'early_bird',
                icon: 'Clock',
                isAutoApplied: true });
            totalDiscount += discount;
        }
    }

    // Last minute rates
    if (
        pricingConfig?.lastMinuteRates?.isEnabled &&
        usersSelectedDate &&
        !isNaN(usersSelectedDate.getTime())
    ) {
        const daysUntilTrip = Math.ceil(
            (usersSelectedDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (
            daysUntilTrip <= pricingConfig.lastMinuteRates.daysBeforeDeparture
        ) {
            const discountValue = pricingConfig.lastMinuteRates.discountValue;
            const discount =
                pricingConfig.lastMinuteRates.discountType === 'PERCENTAGE'
                    ? (subtotal * discountValue) / 100
                    : discountValue;

            discounts.push({
                name: `Last Minute Deal`,
                description: `Booking within ${pricingConfig.lastMinuteRates.daysBeforeDeparture} days`,
                amount: discount,
                percentage:
                    pricingConfig.lastMinuteRates.discountType === 'PERCENTAGE'
                        ? discountValue
                        : null,
                type: 'last_minute',
                icon: 'Zap',
                isAutoApplied: true });
            totalDiscount += discount;
        }
    }

    // Group discounts
    if (pricingConfig?.groupDiscounts?.length > 0) {
        const applicableGroupDiscount = pricingConfig.groupDiscounts
            .filter(discount => totalGuests >= discount.minGroupSize)
            .sort((a, b) => b.discountValue - a.discountValue)[0];

        if (applicableGroupDiscount) {
            const discountValue = applicableGroupDiscount.discountValue;
            const discount =
                applicableGroupDiscount.discountType === 'PERCENTAGE'
                    ? (subtotal * discountValue) / 100
                    : discountValue;

            discounts.push({
                name: `Group Discount`,
                description: `${totalGuests} guests (${applicableGroupDiscount.minGroupSize}+ required)`,
                amount: discount,
                percentage:
                    applicableGroupDiscount.discountType === 'PERCENTAGE'
                        ? discountValue
                        : null,
                type: 'group',
                icon: 'Users',
                isAutoApplied: true });
            totalDiscount += discount;
        }
    }

    // Family package discounts
    if (pricingConfig?.familyPackages?.length > 0 && guests.children > 0) {
        const applicablePackage = pricingConfig.familyPackages.find(
            pkg =>
                guests.adults >= pkg.adultCount &&
                guests.children >= pkg.childCount
        );
        if (applicablePackage) {
            const discount = (subtotal * applicablePackage.discount) / 100;
            discounts.push({
                name: `Family Package`,
                description: applicablePackage.description,
                amount: discount,
                percentage: applicablePackage.discount,
                type: 'family',
                icon: 'UserCheck',
                isAutoApplied: true });
            totalDiscount += discount;
        }
    }

    // Age category discounts
    if (pricingConfig?.ageCategoryPricing?.length > 0 && guests.children > 0) {
        const childPrice =
            currentTier?.basePrice || tripData?.startingPrice || 0;
        const applicableAgeDiscount = pricingConfig.ageCategoryPricing[0];

        if (applicableAgeDiscount) {
            const childDiscount =
                applicableAgeDiscount.discountType === 'PERCENTAGE'
                    ? (childPrice *
                          guests.children *
                          applicableAgeDiscount.discountValue) /
                      100
                    : applicableAgeDiscount.discountValue * guests.children;

            discounts.push({
                name: `Children Discount`,
                description: `${guests.children} children (Ages ${applicableAgeDiscount.ageMin}-${applicableAgeDiscount.ageMax})`,
                amount: childDiscount,
                percentage:
                    applicableAgeDiscount.discountType === 'PERCENTAGE'
                        ? applicableAgeDiscount.discountValue
                        : null,
                type: 'age_category',
                icon: 'UserCheck',
                isAutoApplied: true });
            totalDiscount += childDiscount;
        }
    }

    // Applied promotional codes
    // Applied promotional codes
    if (appliedPromoCodes?.length > 0) {
        appliedPromoCodes.forEach((appliedPromo, index) => {
            const isValidDate =
                !usersSelectedDate ||
                isNaN(usersSelectedDate.getTime()) ||
                (usersSelectedDate >= new Date(appliedPromo.validFrom) &&
                    usersSelectedDate <= new Date(appliedPromo.validUntil));

            if (isValidDate) {
                const discountValue = appliedPromo.discountValue;
                const discount =
                    appliedPromo.discountType === 'PERCENTAGE'
                        ? (subtotal * discountValue) / 100
                        : discountValue;

                discounts.push({
                    name:
                        appliedPromo.description ||
                        `Promo: ${appliedPromo.code}`,
                    description: `Code: ${appliedPromo.code}`,
                    amount: discount,
                    percentage:
                        appliedPromo.discountType === 'PERCENTAGE'
                            ? discountValue
                            : null,
                    type: 'promo',
                    code: appliedPromo.code,
                    icon: 'Percent',
                    isAutoApplied: false });
                totalDiscount += discount;
            } else {
            }
        });
    } else {
    }

    // Add alternatives savings to discounts if there are savings
    if (alternativesSavings > 0) {
        discounts.push({
            name: `Iternerary Modifications`,
            description: `Savings from selected alternatives`,
            amount: alternativesSavings,
            percentage: null,
            type: 'alternatives_savings',
            icon: 'Route',
            isAutoApplied: true });
    }

    // Special event surcharges
    let extraCharges = 0;
    if (
        pricingConfig?.specialEventSurcharges?.length > 0 &&
        usersSelectedDate &&
        !isNaN(usersSelectedDate.getTime())
    ) {
        pricingConfig.specialEventSurcharges.forEach(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);

            if (
                !isNaN(eventStart.getTime()) &&
                !isNaN(eventEnd.getTime()) &&
                usersSelectedDate >= eventStart &&
                usersSelectedDate <= eventEnd
            ) {
                const charges =
                    event.discountType === 'PERCENTAGE'
                        ? (subtotal * event.discountValue) / 100
                        : event.discountValue;
                extraCharges += charges;
            }
        });
    }

    // Holiday surcharges
    if (
        pricingConfig?.holidaySurcharges?.length > 0 &&
        usersSelectedDate &&
        !isNaN(usersSelectedDate.getTime())
    ) {
        pricingConfig.holidaySurcharges.forEach(holiday => {
            const holidayDate = new Date(holiday.date);

            if (
                !isNaN(holidayDate.getTime()) &&
                usersSelectedDate.toDateString() === holidayDate.toDateString()
            ) {
                const charges =
                    holiday.discountType === 'PERCENTAGE'
                        ? (subtotal * holiday.discountValue) / 100
                        : holiday.discountValue;
                extraCharges += charges;
            }
        });
    }

    // Calculate final pricing
    // Note: We don't add alternativesSavings to totalDiscount because it's already included in alternativesPrice
    const actualTotalDiscount = totalDiscount; // Regular discounts only
    const discountedPrice = Math.max(
        0,
        subtotal - actualTotalDiscount + extraCharges
    );

    // Calculate taxes and service charges on the discounted price
    const taxPercentage = pricingConfig?.taxPercentage || 0;
    const serviceChargePercentage = pricingConfig?.serviceChargePercentage || 0;
    const taxes =
        Number(((discountedPrice * taxPercentage) / 100).toFixed(2)) || 0;
    const serviceCharges =
        Number(
            ((discountedPrice * serviceChargePercentage) / 100).toFixed(2)
        ) || 0;
    const total = discountedPrice + taxes + serviceCharges;

    return {
        // Base pricing
        basePrice: basePrice,
        subtotal: subtotal,

        addonsPrice: addonsPrice,
        selectedAddonsCount: selectedAddons?.length || 0,
        addonsBreakdown: selectedAddons.map(addon => ({
            id: addon.id,
            name: addon.name,
            price: addon.price,
            pricingModel: addon.pricingModel,
            totalPrice:
                addon.pricingModel === 'PER_PERSON'
                    ? addon.price * totalGuests
                    : addon.price })),

        // Alternatives breakdown
        alternativesPrice: alternativesPrice, // Net alternatives adjustment (can be negative)
        alternativesSavings: alternativesSavings, // Absolute savings amount
        alternativesUpcharges: alternativesUpcharges, // Absolute upcharge amount
        alternativesBreakdown: alternativesBreakdown, // Detailed breakdown

        // Discounts and charges
        discounts: discounts,
        totalDiscount: actualTotalDiscount, // Regular discounts only
        extraCharges: extraCharges,

        // Final pricing
        discountedPrice: discountedPrice,
        taxes: taxes,
        serviceCharges: serviceCharges,
        total: total,

        // Tax and service charge percentages
        taxPercentage: taxPercentage,
        serviceChargePercentage: serviceChargePercentage,
        // Additional info
        effectiveRate: currentTier
            ? currentTier.basePrice
            : tripData?.startingPrice || 0,
        currentTier: currentTier,

        // Summary flags
        hasSavingsFromAlternatives: alternativesSavings > 0,
        hasUpchargesFromAlternatives: alternativesUpcharges > 0,
        netAlternativesImpact: alternativesPrice, // Positive = increase, Negative = decrease
    };
};

