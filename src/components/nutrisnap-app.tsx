
"use client";

import { useMealLogger, type MealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
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
import { Menu, LogOut, LogIn, Camera, Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MealLogDialog } from './meal-log-dialog';


export function NutriSnapApp() {
  const { isLoaded, addMeal, getTodaysMeals, getTodaysSummary, guestMealCount } = useMealLogger();
  const { user, logOut } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();

  const AuthButtons = ({ inSheet = false }: { inSheet?: boolean }) => (
     <div className={inSheet ? "flex flex-col gap-2 mt-auto" : "flex items-center gap-2"}>
      {user ? (
        <Button variant={inSheet ? "ghost" : "outline"} className={inSheet ? "justify-start w-full text-left" : ""} onClick={logOut}>
            <LogOut className="mr-2 h-5 w-5" />
            Logout
        </Button>
      ) : (
        <Button asChild variant={inSheet ? "ghost" : "outline"} className={inSheet ? "justify-start w-full text-left" : ""}>
            <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Login or Sign Up
            </Link>
        </Button>
      )}
     </div>
  );

  const MealLogButtons = () => (
    <div className="flex gap-2">
      <MealLogDialog 
          onMealLog={addMeal} 
          isGuest={isGuest} 
          guestMealCount={guestMealCount}
          trigger={
              <Button>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Meal
              </Button>
          }
      />
      <MealLogDialog 
          onMealLog={addMeal} 
          isGuest={isGuest} 
          guestMealCount={guestMealCount}
          startWithCamera={true}
          trigger={
              <Button variant="outline">
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo
              </Button>
          }
      />
    </div>
  );


  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-primary opacity-50">NutriSnap</h1>
          </div>
          <div className="flex gap-4 items-center">
             <Skeleton className="h-10 w-32 rounded-md" />
             <Skeleton className="h-10 w-32 rounded-md" />
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
      <header className="flex justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold font-headline text-primary">NutriSnap</h1>
        </div>
        
        <div className="flex items-center gap-2">
            { !isMobile && (
              <>
                <MealLogButtons />
                <AuthButtons />
              </>
            )}
            
            { isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col">
                    <SheetHeader className="mb-4 text-left">
                      <SheetTitle className="text-2xl font-headline">Menu</SheetTitle>
                      <SheetDescription>
                        {user ? `Logged in as ${user.email}` : "You are currently browsing as a guest."}
                      </SheetDescription>
                    </SheetHeader>
                   
                    <AuthButtons inSheet={true} />
                  </SheetContent>
                </Sheet>
            ) }
        </div>

      </header>
      <Dashboard 
        meals={getTodaysMeals()} 
        summary={getTodaysSummary()}
        showLogMealButton={isMobile}
        mealLogButton={<MealLogButtons />}
       />
    </div>
  );
}
