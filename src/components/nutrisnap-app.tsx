
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, LogIn, Camera, Upload, Home, User as UserIcon, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MealLogDialog } from './meal-log-dialog';
import { 
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';


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
              <Button size="lg" variant="outline" className="font-bold text-base w-full py-6 text-lg">
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
              <Button size="lg" variant="outline" className="font-bold text-base w-full py-6 text-lg">
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
            <AvatarImage src={'https://github.com/shadcn.png'} alt={user?.displayName || 'User'} />
            <AvatarFallback>
                {isGuest ? <UserIcon /> : user?.email?.charAt(0).toUpperCase()}
            </Fallback>
        </Avatar>
        <div className="flex flex-col group-[[data-state=collapsed]]:hidden">
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
        <div className="p-3 rounded-lg bg-sidebar-accent/20 border border-sidebar-border group-[[data-state=collapsed]]:hidden">
            <div className="text-center text-sm mb-2">
                <p className="font-bold">{creditsLeft} credits left</p>
                <p className="text-xs text-muted-foreground">Log in for unlimited meals.</p>
            </div>
          <Progress value={progress} className="h-2 bg-sidebar-accent/20" />
        </div>
      );
    }
    return null;
  };

  const AppSidebar = () => {

    const { isMobile, openMobile, setOpenMobile } = useSidebar();

    const sidebarContent = (
      <>
        <SidebarHeader className="flex items-center justify-between p-0">
           {user && <div className="flex items-center gap-2">
             <div className="flex items-center gap-3">
               <UserInfo />
             </div>
           </div>}
           {user && <SidebarTrigger className="hidden" />}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/" isActive={true} size="lg" variant="outline" className="h-12 group-data-[[data-state=collapsed]]:justify-center group-data-[[data-state=collapsed]]:p-0">
                <Home className="h-6 w-6"/>
                <span className="truncate group-[[data-state=collapsed]]:hidden">Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="gap-4">
          <GuestCreditInfo />
          {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center justify-start w-full h-12 p-2 gap-2 group-[[data-state=collapsed]]:hidden">
                         <Avatar className="h-7 w-7">
                           <AvatarImage src={'https://github.com/shadcn.png'} alt={user.displayName || 'User'} />
                          <AvatarFallback>
                              {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon />}
                          </Fallback>
                        </Avatar>
                        <span className="truncate group-[[data-state=collapsed]]:hidden">{user.email}</span>
                        <ChevronUp className="ml-auto h-4 w-4 group-[[data-state=collapsed]]:hidden" />
                    </Button>
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
            <Button asChild variant="outline" className="w-full justify-center text-base h-12 group-[[data-state=collapsed]]:hidden">
              <Link href="/login">
                <LogIn className="h-5 w-5 group-[[data-state=expanded]]:mr-2" />
                <span className="truncate group-[[data-state=collapsed]]:hidden">Login / Sign Up</span>
              </Link>
            </Button>
          )}
        </SidebarFooter>
      </>
    );

    if (isMobile) {
      return (
         <Sheet open={openMobile} onOpenChange={setOpenMobile}>
            <SheetContent side="left" className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground flex flex-col" style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
                 <SheetTitle className="sr-only">Menu</SheetTitle>
                 {sidebarContent}
            </SheetContent>
        </Sheet>
      );
    }

    return (
      <Sidebar>
       {sidebarContent}
      </Sidebar>
    );
  }
  

  if (!isLoaded) {
    return (
      <div className="flex p-4">
         <div className="hidden md:flex flex-col gap-4 w-[16rem]">
            <Skeleton className="h-10" />
            <Skeleton className="h-12" />
            <div className="flex-grow" />
            <Skeleton className="h-20" />
            <Skeleton className="h-12" />
         </div>
         <div className="flex-1 pl-4">
            <header className="flex justify-between items-center mb-8">
                <Skeleton className="h-10 w-48" />
                <div className="hidden md:flex gap-4 items-center">
                    <Skeleton className="h-20 w-48 rounded-md" />
                    <Skeleton className="h-20 w-48 rounded-md" />
                </div>
            </header>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
            </div>
            <div className="grid gap-8 md:grid-cols-5">
                <Skeleton className="h-80 rounded-lg md:col-span-3" />
                <Skeleton className="h-80 rounded-lg md:col-span-2" />
            </div>
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
                      <SidebarTrigger className="md:hidden"/>
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
