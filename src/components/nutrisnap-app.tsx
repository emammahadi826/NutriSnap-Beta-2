
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, LogIn, Camera, Upload, Home as HomeIcon, User as UserIcon, HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MealLogDialog } from './meal-log-dialog';
import { 
  SidebarProvider, 
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export function NutriSnapApp() {
  const { isLoaded, addMeal, getTodaysMeals, getTodaysSummary, guestMealCount } = useMealLogger();
  const { user, logOut } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();
  const GUEST_LIMIT = 3;

  const MealLogButtons = ({ inSheet = false }: { inSheet?: boolean }) => (
    <div className={`flex gap-2 ${inSheet ? 'flex-col' : ''}`}>
      <MealLogDialog 
          onMealLog={addMeal} 
          isGuest={isGuest} 
          guestMealCount={guestMealCount}
          trigger={
              <Button size="lg" variant="outline" className={`font-bold text-base ${inSheet ? 'justify-start' : ''}`}>
                  <Upload className="mr-2 h-6 w-6" />
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
              <Button size="lg" variant="outline" className={`font-bold text-base ${inSheet ? 'justify-start' : ''}`}>
                  <Camera className="mr-2 h-6 w-6" />
                  Take Photo
              </Button>
          }
      />
    </div>
  );

  const UserInfo = () => (
    <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
            {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
            <AvatarFallback>
                {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon />}
            </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <p className="font-semibold text-sm truncate">
                {user ? user.email : "Guest User"}
            </p>
            {!user && 
                <p className="text-xs text-muted-foreground">
                    <Link href="/login" className="underline">Login or Sign up</Link>
                </p>
            }
        </div>
    </div>
  );

  const GuestCreditInfo = () => {
    const creditsUsed = guestMealCount;
    const creditsLeft = GUEST_LIMIT - creditsUsed;
    const progress = (creditsLeft / GUEST_LIMIT) * 100;
  
    if (isGuest) {
      return (
        <div className="p-3 rounded-lg bg-background/50 border border-border/50">
            <div className="text-center text-sm mb-2">
                <p className="font-bold">{creditsLeft} credits left</p>
                <p className="text-xs text-muted-foreground">Log in for unlimited meals.</p>
            </div>
          <Progress value={progress} className="h-2" />
        </div>
      );
    }
    return null;
  };
  

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-primary opacity-50">NutriSnap</h1>
          </div>
          <div className="flex gap-4 items-center">
             <Skeleton className="h-12 w-36 rounded-md" />
             <Skeleton className="h-12 w-36 rounded-md" />
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
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <UserInfo />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton href="/" isActive={true} tooltip="Dashboard">
                            <HomeIcon />
                            <span>Home</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <MealLogDialog 
                          onMealLog={addMeal} 
                          isGuest={isGuest} 
                          guestMealCount={guestMealCount}
                          trigger={
                              <button className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8 text-sm">
                                  <Upload />
                                  <span>Upload Meal</span>
                              </button>
                          }
                      />
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <MealLogDialog 
                          onMealLog={addMeal} 
                          isGuest={isGuest} 
                          guestMealCount={guestMealCount}
                          startWithCamera={true}
                          trigger={
                               <button className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-8 text-sm">
                                  <Camera />
                                  <span>Take Photo</span>
                              </button>
                          }
                      />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="gap-4">
                <GuestCreditInfo />
                {user ? (
                    <Button variant="ghost" onClick={logOut}>
                        <LogOut />
                        <span>Logout</span>
                    </Button>
                ) : (
                    <Button asChild variant="ghost">
                        <Link href="/login">
                            <LogIn />
                            <span>Login / Sign Up</span>
                        </Link>
                    </Button>
                )}
            </SidebarFooter>
        </Sidebar>

        <SidebarInset>
             <div className="container mx-auto p-4 md:p-8">
                <header className="flex justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden" />
                        <h1 className="text-4xl font-bold font-headline text-primary">NutriSnap</h1>
                    </div>
                </header>
                <Dashboard 
                    meals={getTodaysMeals()} 
                    summary={getTodaysSummary()}
                    showLogMealButton={false}
                    mealLogButton={<MealLogButtons />}
                />
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
