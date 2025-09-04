
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, LogIn, Home, User as UserIcon, ChevronUp, MessageCircle } from 'lucide-react';
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
  SheetTitle,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';
import { ChatPage } from './chat-page';


export function NutriSnapApp() {
  const { isLoaded, getTodaysMeals, getTodaysSummary, guestMealCount } = useMealLogger();
  const { user, logOut } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();
  const [activePage, setActivePage] = useState<'home' | 'chat'>('home');
  const GUEST_LIMIT = 3;

  const GuestCreditInfo = () => {
    const creditsUsed = guestMealCount;
    const creditsLeft = GUEST_LIMIT - creditsUsed;
    const progress = (creditsLeft / GUEST_LIMIT) * 100;
  
    if (isGuest) {
      return (
        <div className="p-3 rounded-lg bg-sidebar-accent/20 border border-sidebar-border group-data-[[data-state=expanded]]:block hidden">
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
    const { openMobile, setOpenMobile, state } = useSidebar();
  
    const sidebarContent = (
      <>
        <SidebarHeader className="p-4 flex items-center justify-center h-[69px]">
           {state === 'expanded' ? (
                <h1 className="text-primary font-headline text-2xl">NutriSnap</h1>
            ) : (
                <div className="text-primary font-headline font-bold text-3xl">N</div>
            )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => { setActivePage('home'); if (isMobile) setOpenMobile(false); }} isActive={activePage === 'home'} variant={'outline'} size="lg" className="h-12 group-data-[[data-state=collapsed]]:justify-center group-data-[[data-state=collapsed]]:p-0">
                <Home className="h-6 w-6"/>
                <span className="truncate group-data-[[data-state=collapsed]]:hidden">Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={() => { setActivePage('chat'); if (isMobile) setOpenMobile(false); }} isActive={activePage === 'chat'} variant={'outline'} size="lg" className="h-12 group-data-[[data-state=collapsed]]:justify-center group-data-[[data-state=collapsed]]:p-0">
                    <MessageCircle className="h-6 w-6"/>
                    <span className="truncate group-data-[[data-state=collapsed]]:hidden">Chat</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="gap-4 group-data-[[data-state=collapsed]]:hidden">
          <GuestCreditInfo />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center justify-start w-full h-12 p-2 gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={'https://github.com/shadcn.png'} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon />}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.email}</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
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
            <Button asChild variant="outline" className="w-full justify-center text-base h-12">
              <Link href="/login">
                <LogIn className="h-5 w-5 mr-2" />
                <span className="truncate">Login / Sign Up</span>
              </Link>
            </Button>
          )}
        </SidebarFooter>
      </>
    );
  
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left" className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground flex flex-col border-r" style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarHeader className="p-4 flex items-center justify-center h-[69px] border-b">
               <h1 className="text-primary font-headline text-2xl">NutriSnap</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => { setActivePage('home'); if (isMobile) setOpenMobile(false); }} isActive={activePage === 'home'} variant={'outline'} size="lg" className="h-12">
                    <Home className="h-6 w-6"/>
                    <span className="truncate">Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => { setActivePage('chat'); if (isMobile) setOpenMobile(false); }} isActive={activePage === 'chat'} variant={'outline'} size="lg" className="h-12">
                        <MessageCircle className="h-6 w-6"/>
                        <span className="truncate">Chat</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="gap-4">
              <GuestCreditInfo />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center justify-start w-full h-12 p-2 gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={'https://github.com/shadcn.png'} alt={user.displayName || 'User'} />
                        <AvatarFallback>
                          {user?.email ? user.email.charAt(0).toUpperCase() : <UserIcon />}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate">{user.email}</span>
                      <ChevronUp className="ml-auto h-4 w-4" />
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
                <Button asChild variant="outline" className="w-full justify-center text-base h-12">
                  <Link href="/login">
                    <LogIn className="h-5 w-5 mr-2" />
                    <span className="truncate">Login / Sign Up</span>
                  </Link>
                </Button>
              )}
            </SidebarFooter>
          </SheetContent>
        </Sheet>
      );
    }
  
    return (
      <Sidebar>
        {sidebarContent}
      </Sidebar>
    );
  };
  
  if (!isLoaded) {
    return (
      <div className="flex h-screen bg-background">
         <div className="hidden md:flex flex-col gap-4 w-[16rem] p-4 border-r">
            <div className="flex items-center gap-2 h-[69px] p-4 justify-center">
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
            <div className="flex-grow" />
            <div className="p-4 flex flex-col gap-4">
                <Skeleton className="h-20" />
                <Skeleton className="h-12" />
            </div>
         </div>
         <main className="flex-1 flex flex-col">
            <header className="flex h-[69px] items-center px-4 border-b md:hidden">
                 <SidebarTrigger />
             </header>
            <div className="flex-1 p-4 md:p-8 overflow-auto">
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
         </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="flex h-[69px] items-center px-4 border-b">
            <SidebarTrigger />
          </header>
          <div className={activePage === 'home' ? "overflow-auto p-4 md:p-8" : "overflow-hidden h-[calc(100vh-69px)]"}>
            {activePage === 'home' ? (
              <Dashboard 
                  meals={getTodaysMeals()} 
                  summary={getTodaysSummary()}
              />
            ) : (
              <ChatPage />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
