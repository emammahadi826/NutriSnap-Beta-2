"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { MealLogDialog } from '@/components/meal-log-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User, LogOut, LogIn } from 'lucide-react';


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
            <Skeleton className="h-10 w-10 rounded-full" />
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
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-headline">Menu</SheetTitle>
                <SheetDescription>
                  {user ? `Logged in as ${user.email}` : "You are currently browsing as a guest."}
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4">
                 {user ? (
                    <Button variant="ghost" className="justify-start" onClick={logOut}>
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Button>
                  ) : (
                    <>
                    <Button asChild variant="ghost" className="justify-start">
                        <Link href="/login">
                            <LogIn className="mr-2 h-5 w-5" />
                            Login or Sign Up
                        </Link>
                    </Button>
                     <Button asChild>
                        <Link href="/login">
                           Get Started
                        </Link>
                    </Button>
                    </>
                  )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <Dashboard meals={getTodaysMeals()} summary={getTodaysSummary()} />
    </div>
  );
}
