
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Meal, DailySummary } from '@/lib/types';
import { isToday } from 'date-fns';
import { useAuth } from './use-auth';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, writeBatch, query, orderBy, getDoc, setDoc } from 'firebase/firestore';

const GUEST_MEALS_STORAGE_KEY = 'nutrisnap_guest_meals';

export interface MealLogger {
    isLoaded: boolean;
    meals: Meal[];
    addMeal: (newMeal: Omit<Meal, 'id' | 'timestamp'>) => Promise<void>;
    getTodaysMeals: () => Meal[];
    getAllMeals: () => Meal[];
    getTodaysSummary: () => DailySummary;
    guestMealCount: number;
}


export function useMealLogger(): MealLogger {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [guestMealCount, setGuestMealCount] = useState(0);

  const getMealsCollection = useCallback(() => {
    if (!user) throw new Error("User not authenticated");
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
        // User is a guest, fetch from localStorage
        try {
          const storedMeals = localStorage.getItem(GUEST_MEALS_STORAGE_KEY);
          if (storedMeals) {
            const parsedMeals: Meal[] = JSON.parse(storedMeals);
            setMeals(parsedMeals);
            setGuestMealCount(parsedMeals.length);
          } else {
            setMeals([]);
            setGuestMealCount(0);
          }
        } catch (error) {
            console.error("Failed to load meals from local storage", error);
            setMeals([]);
            setGuestMealCount(0);
        } finally {
            setIsLoaded(true);
        }
      }
    };

    fetchMeals();
  }, [user, getMealsCollection]);
  
    useEffect(() => {
    // When user logs in, migrate guest data
    const migrateGuestData = async () => {
      if (user) {
        try {
          const storedMeals = localStorage.getItem(GUEST_MEALS_STORAGE_KEY);
          if (storedMeals) {
            const guestMeals: Meal[] = JSON.parse(storedMeals);
            if (guestMeals.length > 0) {
              const mealsCollection = getMealsCollection();
              const batch = writeBatch(db);
              
              // Check existing meals to avoid duplicates
              const existingMealsSnapshot = await getDocs(mealsCollection);
              const existingMealIds = new Set(existingMealsSnapshot.docs.map(d => d.id));

              guestMeals.forEach(meal => {
                if (!existingMealIds.has(meal.id)) {
                    const newDocRef = doc(mealsCollection, meal.id);
                    batch.set(newDocRef, meal);
                }
              });
              
              await batch.commit();
              localStorage.removeItem(GUEST_MEALS_STORAGE_KEY); // Clear guest data after migration
            }
          }
        } catch(e) {
            console.error("Failed to migrate guest data", e);
        }
      }
    };
    
    migrateGuestData();
  }, [user, getMealsCollection]);


  const addMeal = useCallback(async (newMeal: Omit<Meal, 'id' | 'timestamp'>) => {
    const mealWithId: Meal = {
      ...newMeal,
      id: new Date().toISOString(),
      timestamp: Date.now(),
    };
    
    setMeals(prevMeals => [mealWithId, ...prevMeals].sort((a,b) => b.timestamp - a.timestamp));

    if (user) {
        // Save to Firestore for logged-in user
        try {
            const mealsCollection = getMealsCollection();
            const newDocRef = doc(mealsCollection, mealWithId.id);
            await setDoc(newDocRef, mealWithId);
        } catch (error) {
            console.error("Failed to save meal to Firestore", error);
            setMeals(prevMeals => prevMeals.filter(m => m.id !== mealWithId.id));
        }
    } else {
        // Save to localStorage for guest
        try {
            const currentGuestMeals = meals.filter(m => m.id !== mealWithId.id);
            const updatedGuestMeals = [mealWithId, ...currentGuestMeals];
            localStorage.setItem(GUEST_MEALS_STORAGE_KEY, JSON.stringify(updatedGuestMeals));
            setGuestMealCount(updatedGuestMeals.length);
        } catch (error) {
            console.error("Failed to save meal to local storage", error);
            setMeals(prevMeals => prevMeals.filter(m => m.id !== mealWithId.id));
        }
    }
  }, [user, getMealsCollection, meals]);

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

  return { isLoaded, meals, addMeal, getTodaysMeals, getAllMeals, getTodaysSummary, guestMealCount };
}
