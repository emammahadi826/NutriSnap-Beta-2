"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { MealLogDialog } from '@/components/meal-log-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export function NutriSnapApp() {
  const { isLoaded, addMeal, getTodaysMeals, getTodaysSummary } = useMealLogger();

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary opacity-50">NutriSnap</h1>
          <Skeleton className="h-12 w-36 rounded-md" />
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold font-headline text-primary">NutriSnap</h1>
        <MealLogDialog onMealLog={addMeal} />
      </header>
      <Dashboard meals={getTodaysMeals()} summary={getTodaysSummary()} />
    </div>
  );
}
