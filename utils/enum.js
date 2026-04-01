import { z } from 'zod';

export const MealCategory = z.enum(['breakfast', 'lunch', 'dinner', 'dessert', 'beverage', 'appetizer', 'continental']);
export const dietaryOptions = z.enum([
    'vegetarian',
    'vegan',
    'glutenFree',
    'dairyFree',
    'nutFree',
    'shellFish',
    'halal',
    'kosher',
]);

export const Difficulty = z.enum(['Easy', 'Moderate', 'Hard', 'Extream']);

export const categoriesTypes = z.enum([
    'GENERAL',
    'TOUR_TYPE',
    'CURRENCY',
    'DIFFICULTY_LEVEL',
    'SUITABLE_FOR',
    'TOUR_STYLE',
    'INCLUSIONS',
    'EXCLUSIONS',
    'AGE_CATEGORY',
    'PREPARATION',
    'POLICIES',
    'FAQ',
    'CUSTOMISATION',
    'UNKNOWN',
]);

