"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Meal, DailySummary } from '@/lib/types';
import { isToday } from 'date-fns';

const MEALS_STORAGE_KEY = 'nutrisnap_meals';

export function useMealLogger() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedMeals = localStorage.getItem(MEALS_STORAGE_KEY);
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    } catch (error) {
      console.error("Failed to load meals from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
      } catch (error) {
        console.error("Failed to save meals to localStorage", error);
      }
    }
  }, [meals, isLoaded]);

  const addMeal = useCallback((newMeal: Omit<Meal, 'id' | 'timestamp'>) => {
    const mealWithId: Meal = {
      ...newMeal,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };
    setMeals(prevMeals => [mealWithId, ...prevMeals]);
  }, []);

  const getTodaysMeals = useCallback((): Meal[] => {
    if (!isLoaded) return [];
    return meals.filter(meal => isToday(new Date(meal.timestamp)));
  }, [meals, isLoaded]);
  
  const getTodaysSummary = useCallback((): DailySummary => {
    const todaysMeals = getTodaysMeals();
    return todaysMeals.reduce(
      (summary, meal) => {
        meal.items.forEach(item => {
          summary.calories += item.food.calories * item.servings;
          summary.protein += item.food.protein * item.servings;
          summary.carbs += item.food.carbs * item.servings;
          summary.fat += item.food.fat * item.servings;
        });
        return summary;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [getTodaysMeals]);

  return { isLoaded, meals, addMeal, getTodaysMeals, getTodaysSummary };
}
