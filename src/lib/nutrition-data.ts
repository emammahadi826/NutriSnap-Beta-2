import type { Food } from './types';

// A limited internal dataset of food items.
// In a real app, this would be a large database.
export const nutritionData: Map<string, Food> = new Map([
  [
    'apple',
    { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, unit: '1 medium' },
  ],
  [
    'banana',
    { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, unit: '1 medium' },
  ],
  [
    'chicken breast',
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
  ],
  [
    'rice',
    { name: 'Rice', calories: 205, protein: 4.3, carbs: 45, fat: 0.4, unit: '1 cup cooked' },
  ],
  [
    'broccoli',
    { name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, unit: '1 cup' },
  ],
  [
    'salmon',
    { name: 'Salmon', calories: 208, protein: 22, carbs: 0, fat: 13, unit: '100g' },
  ],
  [
    'pizza',
    { name: 'Pizza', calories: 285, protein: 12, carbs: 36, fat: 10, unit: '1 slice' },
  ],
   [
    'burger',
    { name: 'Burger', calories: 354, protein: 20, carbs: 28, fat: 18, unit: '1 burger' },
  ],
  [
    'salad',
    { name: 'Salad', calories: 150, protein: 5, carbs: 10, fat: 10, unit: '1 bowl' },
  ],
  [
    'fries',
    { name: 'Fries', calories: 312, protein: 3.4, carbs: 41, fat: 15, unit: '1 medium serving' },
  ],
  [
    'pasta',
    { name: 'Pasta', calories: 220, protein: 8, carbs: 43, fat: 1.3, unit: '1 cup cooked' },
  ],
  [
    'steak',
    { name: 'Steak', calories: 271, protein: 25, carbs: 0, fat: 19, unit: '100g' },
  ]
]);

export function findFood(name: string): Food | undefined {
    const normalizedName = name.toLowerCase().trim().replace(/s$/, ''); // remove plural 's'
    
    // Try for an exact match first
    if (nutritionData.has(normalizedName)) {
        return nutritionData.get(normalizedName);
    }

    // Try to find a partial match in the keys
    for (const key of nutritionData.keys()) {
        if (normalizedName.includes(key)) {
            return nutritionData.get(key);
        }
    }

    // Try to find a partial match from the name in our keys
     for (const key of nutritionData.keys()) {
        if (key.includes(normalizedName)) {
            return nutritionData.get(key);
        }
    }

    return undefined;
}
