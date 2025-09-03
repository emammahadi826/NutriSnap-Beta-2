
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, LogIn, Camera, Upload, Home, User as UserIcon, X, PanelLeft, ChevronUp } from 'lucide-react';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

export function NutriSnapApp() {
  const { isLoaded, addMeal, getTodaysMeals, getTodaysSummary, guestMealCount } = useMealLogger();
  const { user, logOut } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();
  const GUEST_LIMIT = 3;

  const MealLogButtons = ({ inSheet = false }: { inSheet?: boolean }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${inSheet ? 'flex-col' : ''}`}>
      <MealLogDialog 
          onMealLog={addMeal} 
          isGuest={isGuest} 
          guestMealCount={guestMealCount}
          trigger={
              <Button size="lg" variant="outline" className="font-bold text-base w-full py-8 text-lg">
                  <Upload className="mr-3 h-6 w-6" />
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
              <Button size="lg" variant="outline" className="font-bold text-base w-full py-8 text-lg">
                  <Camera className="mr-3 h-6 w-6" />
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

  const AppSidebar = () => {
    const { setOpenMobile } = useSidebar();

    const SidebarItems = () => (
      <>
        <SidebarHeader>
          <UserInfo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={true} size="lg" className="h-12">
                <Home className="h-5 w-5"/>
                <span className="text-base">Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="gap-4">
          <GuestCreditInfo />
          {user ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="h-8 w-8">
                      {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                      <AvatarFallback>
                          {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{user.email}</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem onClick={logOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            <Button asChild variant="outline" className="w-full justify-center text-base h-12">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                <span>Login / Sign Up</span>
              </Link>
            </Button>
          )}
        </SidebarFooter>
      </>
    );

    const { isMobile, openMobile, setOpenMobile: setOpen } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpen}>
          <SheetContent side="left" className="bg-sidebar text-sidebar-foreground flex flex-col p-0 w-[18rem]">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SidebarItems />
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <Sidebar>
        <SidebarItems />
      </Sidebar>
    );
  }
  

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
        <AppSidebar />
        <SidebarInset>
             <div className="container mx-auto p-4 md:p-8">
                <header className="flex justify-between items-center mb-8 gap-4">
                    <div className="flex items-center gap-2">
                         <SidebarTrigger className="md:hidden h-12 w-12">
                            <PanelLeft className="h-6 w-6"/>
                        </SidebarTrigger>
                        <h1 className="text-4xl font-bold font-headline text-primary">NutriSnap</h1>
                    </div>
                    { !isMobile && <MealLogButtons /> }
                </header>
                <Dashboard 
                    meals={getTodaysMeals()} 
                    summary={getTodaysSummary()}
                    showLogMealButton={isMobile}
                    mealLogButton={<MealLogButtons />}
                />
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
