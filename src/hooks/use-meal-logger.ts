
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Meal, DailySummary } from '@/lib/types';
import { isToday } from 'date-fns';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, query, orderBy, getDoc, setDoc } from 'firebase/firestore';

export interface MealLogger {
    isLoaded: boolean;
    meals: Meal[];
    addMeal: (newMeal: Omit<Meal, 'id' | 'timestamp'>) => Promise<void>;
    getTodaysMeals: () => Meal[];
    getAllMeals: () => Meal[];
    getTodaysSummary: () => DailySummary;
}


export function useMealLogger(): MealLogger {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const getMealsCollection = useCallback(() => {
    if (!user) throw new Error("User not authenticated to get meal collection.");
    return collection(db, 'users', user.uid, 'meals');
  }, [user]);

  useEffect(() => {
    const fetchMeals = async () => {
      setIsLoaded(false);
      if (user) {
        // User is logged in, fetch from Firestore
        try {
          const mealsCollection = getMealsCollection();
          const q = query(mealsCollection, orderBy('timestamp', 'desc'));
          const snapshot = await getDocs(q);
          const mealsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Meal));
          setMeals(mealsData);
        } catch (error) {
          console.error("Failed to load meals from Firestore", error);
          setMeals([]);
        } finally {
          setIsLoaded(true);
        }
      } else {
        // User is a guest, clear any existing meals from state
        setMeals([]);
        setIsLoaded(true);
      }
    };

    fetchMeals();
  }, [user, getMealsCollection]);


  const addMeal = useCallback(async (newMeal: Omit<Meal, 'id' | 'timestamp'>) => {
    if (!user) {
        console.error("User is not authenticated. Cannot log meal.");
        // Optionally, you can throw an error or handle this case in the UI.
        return;
    }

    const mealWithId: Meal = {
      ...newMeal,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };
    
    setMeals(prevMeals => [mealWithId, ...prevMeals].sort((a,b) => b.timestamp - a.timestamp));

    // Save to Firestore for logged-in user
    try {
        const mealsCollection = getMealsCollection();
        const newDocRef = doc(mealsCollection, mealWithId.id);
        await setDoc(newDocRef, mealWithId);
    } catch (error) {
        console.error("Failed to save meal to Firestore", error);
        // Rollback state change on error
        setMeals(prevMeals => prevMeals.filter(m => m.id !== mealWithId.id));
    }
  }, [user, getMealsCollection]);

  const getTodaysMeals = useCallback((): Meal[] => {
    if (!isLoaded) return [];
    return meals.filter(meal => isToday(new Date(meal.timestamp)));
  }, [meals, isLoaded]);

  const getAllMeals = useCallback((): Meal[] => {
    if (!isLoaded) return [];
    return meals;
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

  return { isLoaded, meals, addMeal, getTodaysMeals, getAllMeals, getTodaysSummary };
}
