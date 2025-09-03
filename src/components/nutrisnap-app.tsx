"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { MealLogDialog } from '@/components/meal-log-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';

export function NutriSnapApp() {
  const { isLoaded, addMeal, getTodaysMeals, getTodaysSummary, guestMealCount } = useMealLogger();
  const { user, logOut } = useAuth();
  const isGuest = !user;

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary opacity-50">NutriSnap</h1>
          <div className="flex gap-4 items-center">
            <Skeleton className="h-12 w-36 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
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
        <div className="flex gap-4 items-center">
          <MealLogDialog onMealLog={addMeal} isGuest={isGuest} guestMealCount={guestMealCount} />
          {user ? (
            <Button variant="outline" onClick={logOut}>Logout</Button>
          ) : (
            <Button asChild variant="outline">
                <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </header>
      <Dashboard meals={getTodaysMeals()} summary={getTodaysSummary()} />
    </div>
  );
}
