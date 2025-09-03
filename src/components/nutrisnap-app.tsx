
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, LogIn, Camera, Upload, Home, User as UserIcon, ChevronUp, MessageCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { useState } from 'react';
import { ChatPage } from './chat-page';


export function NutriSnapApp() {
  const { isLoaded, addMeal, getTodaysMeals, getTodaysSummary, guestMealCount } = useMealLogger();
  const { user, logOut } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();
  const [activePage, setActivePage] = useState<'home' | 'chat'>('home');
  const GUEST_LIMIT = 3;

  const UserInfo = () => (
    <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
            <AvatarImage src={'https://github.com/shadcn.png'} alt={user?.displayName || 'User'} />
            <AvatarFallback>
                {isGuest ? <UserIcon /> : user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
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
    const { openMobile, setOpenMobile } = useSidebar();
  
    const sidebarContent = (
      <>
        {user && !isMobile && (
          <SidebarHeader className="flex items-center justify-between p-2">
              <UserInfo />
              <SidebarTrigger className="hidden md:flex" />
          </SidebarHeader>
        )}
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setActivePage('home')} isActive={activePage === 'home'} variant={activePage === 'home' ? 'outline' : 'ghost'} size="lg" className="h-12 group-data-[[data-state=collapsed]]:justify-center group-data-[[data-state=collapsed]]:p-0">
                <Home className="h-6 w-6"/>
                <span className="truncate group-[[data-state=collapsed]]:hidden">Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActivePage('chat')} isActive={activePage === 'chat'} variant={activePage === 'chat' ? 'outline' : 'ghost'} size="lg" className="h-12 group-data-[[data-state=collapsed]]:justify-center group-data-[[data-state=collapsed]]:p-0">
                    <MessageCircle className="h-6 w-6"/>
                    <span className="truncate group-[[data-state=collapsed]]:hidden">Chat</span>
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
                    </AvatarFallback>
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
            <SidebarHeader className="p-4 border-b">
                <SheetTitle className="text-primary font-headline text-2xl">NutriSnap</SheetTitle>
            </SidebarHeader>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      );
    }
  
    return (
      <Sidebar>
        <SidebarHeader className="p-4 border-b group-[[data-state=collapsed]]:hidden">
            <h1 className="text-primary font-headline text-2xl">NutriSnap</h1>
        </SidebarHeader>
        {sidebarContent}
      </Sidebar>
    );
  };
  

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
                    <Skeleton className="h-12 w-32 rounded-md" />
                    <Skeleton className="h-12 w-32 rounded-md" />
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
           <header className="border-b p-4 flex justify-between items-center h-[69px]">
               <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden"/>
                </div>
           </header>
           <div className="container mx-auto p-4 md:p-8">
              {activePage === 'home' ? (
                <Dashboard 
                    meals={getTodaysMeals()} 
                    summary={getTodaysSummary()}
                />
              ) : (
                <ChatPage />
              )}
          </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
