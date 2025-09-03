"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Meal, DailySummary } from '@/lib/types';
import { isToday } from 'date-fns';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';


export function useMealLogger() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getMealsCollection = useCallback(() => {
    if (!user) throw new Error("User not authenticated");
    return collection(db, 'users', user.uid, 'meals');
  }, [user]);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!user) {
        setIsLoaded(true);
        return;
      };
      try {
        const mealsCollection = getMealsCollection();
        const q = query(mealsCollection, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        const mealsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Meal));
        setMeals(mealsData);
      } catch (error) {
        console.error("Failed to load meals from Firestore", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchMeals();
  }, [user, getMealsCollection]);


  const addMeal = useCallback(async (newMeal: Omit<Meal, 'id' | 'timestamp'>) => {
    if (!user) return;
    const mealWithId: Meal = {
      ...newMeal,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };
    
    setMeals(prevMeals => [mealWithId, ...prevMeals]);

    try {
        const mealsCollection = getMealsCollection();
        const batch = writeBatch(db);
        const newDocRef = doc(mealsCollection, mealWithId.id);
        batch.set(newDocRef, mealWithId);
        await batch.commit();
    } catch (error) {
        console.error("Failed to save meal to Firestore", error);
        // Optionally, revert local state update
        setMeals(prevMeals => prevMeals.filter(m => m.id !== mealWithId.id));
    }
  }, [user, getMealsCollection]);

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
