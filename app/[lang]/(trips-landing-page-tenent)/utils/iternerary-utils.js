// Get modified itinerary with alternatives
export const getModifiedItineraryWithAlternatives = (itineraryDays, alternatives) => {
    if (!itineraryDays) return [];

    return itineraryDays.map(day => {
        const dayId = day.id;
        const modifiedDay = { ...day };
        let isModified = false;

        // Apply alternatives to the day
        Object.entries(alternatives).forEach(([type, selections]) => {
            if (selections[dayId]) {
                switch (type) {
                    case 'hotel':
                        modifiedDay.hotel = selections[dayId];
                        break;
                    case 'meals':
                        const newMeals = Array.isArray(selections[dayId]) ? selections[dayId] : [selections[dayId]];

                        let existingMeals = modifiedDay.meals || [];
                        newMeals.forEach(newMeal => {
                            const mealCategory = newMeal.category || newMeal.type;
                            existingMeals = existingMeals.filter(meal => (meal.category || meal.type) !== mealCategory);
                            existingMeals.push(newMeal);
                        });
                        modifiedDay.meals = existingMeals;
                        break;
                    case 'transportation':
                        modifiedDay.transferDetails = selections[dayId];
                        break;
                    case 'activities':
                        modifiedDay.activities = selections[dayId];
                        break;
                    case 'sightseeing':
                        modifiedDay.sightseeing = selections[dayId];
                        break;
                }
                isModified = true;
            }
        });

        if (isModified) {
            modifiedDay.isModified = true;
        }

        return modifiedDay;
    });
};

