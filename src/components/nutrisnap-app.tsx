
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, LogIn, Home, User as UserIcon, ChevronUp, MessageCircle, Upload, Camera, Settings as SettingsIcon } from 'lucide-react';
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
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import React, { useState } from 'react';
import { ChatPage } from './chat-page';
import { cn } from '@/lib/utils';
import { MealLogDialog } from './meal-log-dialog';
import { SettingsPage } from '@/components/settings/settings-page';
import { ClientOnly } from './client-only';
import { ReportPage } from '@/components/report/report-page';
import { BarChart2 } from 'lucide-react';

const ReportPageDynamic = React.lazy(() => import('@/components/report/report-page').then(module => ({ default: module.ReportPage })));
const SettingsPageDynamic = React.lazy(() => import('@/components/settings/settings-page').then(module => ({ default: module.SettingsPage })));


export function NutriSnapApp() {
  const { isLoaded, meals, addMeal, getTodaysSummary } = useMealLogger();
  const { user, userProfile, logOut, loading: authLoading } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();
  const [activePage, setActivePage] = useState<'home' | 'chat' | 'settings' | 'report'>('home');
  
  const isLoading = authLoading || !isLoaded;

  const AppSidebar = () => {
    const { openMobile, setOpenMobile, state } = useSidebar();
  
    const handleMenuItemClick = (page: 'home' | 'chat' | 'settings' | 'report') => {
        setActivePage(page);
        if (isMobile) {
            setOpenMobile(false);
        }
    }
    
    const getUserDisplayName = () => {
        if (userProfile?.displayName) {
            return userProfile.displayName;
        }
        if (user?.email) {
            return user.email.length > 10 ? `${user.email.substring(0, 10)}...` : user.email;
        }
        return 'User';
    };

    const sidebarContent = (
      <>
        <SidebarHeader className="p-4 flex items-center justify-center h-[69px]">
            {state === 'expanded' ? (
                <h1 className="text-primary font-headline text-2xl">NutriSnap</h1>
            ) : (
                <div className="text-primary font-headline font-bold text-3xl">N</div>
            )}
        </SidebarHeader>
        <SidebarContent className="flex flex-col">
          <SidebarMenu className="flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleMenuItemClick('home')} isActive={activePage === 'home'} variant={'outline'} size="lg" className="h-12">
                <Home className="h-6 w-6"/>
                <span className={cn(state === 'collapsed' && 'hidden')}>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleMenuItemClick('chat')} isActive={activePage === 'chat'} variant={'outline'} size="lg" className="h-12">
                    <MessageCircle className="h-6 w-6"/>
                    <span className={cn(state === 'collapsed' && 'hidden')}>Chat</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleMenuItemClick('report')} isActive={activePage === 'report'} variant={'outline'} size="lg" className="h-12">
                    <BarChart2 className="h-6 w-6"/>
                    <span className={cn(state === 'collapsed' && 'hidden')}>Report</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <ClientOnly>
            <div className={cn("flex flex-col gap-4", state === 'collapsed' && 'p-2 items-center')}>
              
              <div className={cn(state === 'collapsed' ? 'hidden' : 'block')}>
                  <SidebarSeparator />
              </div>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className={cn("flex items-center w-full h-12 p-2 gap-2", state === 'expanded' ? 'justify-start' : 'justify-center')}>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                        <AvatarFallback>
                          {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <UserIcon />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("flex-1 flex items-center", state === 'collapsed' && 'hidden')}>
                          <span className="truncate ml-1">{getUserDisplayName()}</span>
                          <ChevronUp className="ml-auto h-4 w-4" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align={state === 'expanded' ? 'end' : 'center'}
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem onClick={() => handleMenuItemClick('settings')}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="outline" className={cn("w-full justify-center text-base h-12", state === 'collapsed' && 'h-10 w-10 p-0')}>
                  <Link href="/login">
                    <LogIn className="h-5 w-5" />
                    <span className={cn("truncate", state === 'collapsed' && 'hidden')}>Login</span>
                  </Link>
                </Button>
              )}
            </div>
          </ClientOnly>
        </SidebarFooter>
      </>
    );
  
    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left" className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground flex flex-col border-r" style={{ "--sidebar-width": "16rem" } as React.CSSProperties}>
              <SheetTitle>Sidebar Menu</SheetTitle>
              <SidebarHeader className="p-4 flex items-center justify-center h-[69px] border-b">
                <h1 className="text-primary font-headline text-2xl">NutriSnap</h1>
              </SidebarHeader>
              <SidebarContent className="flex flex-col">
              <SidebarMenu className="flex-1">
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => handleMenuItemClick('home')} isActive={activePage === 'home'} variant={'outline'} size="lg" className="h-12">
                    <Home className="h-6 w-6"/>
                    <span className="truncate">Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => handleMenuItemClick('chat')} isActive={activePage === 'chat'} variant={'outline'} size="lg" className="h-12">
                        <MessageCircle className="h-6 w-6"/>
                        <span className="truncate">Chat</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => handleMenuItemClick('report')} isActive={activePage === 'report'} variant={'outline'} size="lg" className="h-12">
                        <BarChart2 className="h-6 w-6"/>
                        <span className="truncate">Report</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <ClientOnly>
                  <div className="flex flex-col gap-4">
                      <SidebarSeparator />

                      {user ? (
                          <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className={cn("flex items-center w-full h-12 p-2 gap-2", "justify-start")}>
                              <Avatar className="h-8 w-8 rounded-lg">
                                  <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                                  <AvatarFallback>
                                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <UserIcon />}
                                  </AvatarFallback>
                              </Avatar>
                              <div className={cn("flex-1 flex items-center justify-between")}>
                                  <span className="truncate ml-1">{getUserDisplayName()}</span>
                                  <ChevronUp className="ml-auto h-4 w-4" />
                              </div>
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                              side="top"
                              className="w-[--radix-popper-anchor-width]"
                          >
                            <DropdownMenuItem onClick={() => handleMenuItemClick('settings')}>
                                  <SettingsIcon className="mr-2 h-4 w-4" />
                                  <span>Settings</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={logOut}>
                                  <LogOut className="mr-2 h-4 w-4" />
                                  <span>Sign Out</span>
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
                  </div>
              </ClientOnly>
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

  const summary = getTodaysSummary();
  
  const renderActivePage = () => {
    switch (activePage) {
        case 'home':
            return <Dashboard meals={meals} summary={summary} />;
        case 'chat':
            return <ChatPage />;
        case 'settings':
            return (
                <React.Suspense fallback={<SettingsPageSkeleton />}>
                    <SettingsPageDynamic onBack={() => setActivePage('home')} />
                </React.Suspense>
            );
        case 'report':
            return (
                <React.Suspense fallback={<div className="p-8">Loading report...</div>}>
                    <ReportPageDynamic meals={meals} />
                </React.Suspense>
            );
        default:
            return <Dashboard meals={meals} summary={summary} />;
    }
  }

  function SettingsPageSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-80" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full max-w-sm" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <Skeleton className="h-11 w-32" />
        </div>
    )
}


  return (
      <SidebarProvider>
         <div className="flex h-screen bg-background">
          <AppSidebar />
           <main className="flex-1 flex flex-col">
            <header className="flex h-[69px] items-center px-4 border-b">
                <SidebarTrigger />
                <div className="flex items-center gap-2 ml-auto">
                    {activePage === 'home' && (
                        <>
                            <MealLogDialog
                                onMealLog={addMeal}
                                trigger={
                                    <Button variant="ghost" size="icon">
                                        <Upload className="h-5 w-5" />
                                        <span className="sr-only">Upload Meal</span>
                                    </Button>
                                }
                            />
                            <MealLogDialog
                                onMealLog={addMeal}
                                startWithCamera={true}
                                trigger={
                                    <Button variant="ghost" size="icon">
                                        <Camera className="h-5 w-5" />
                                        <span className="sr-only">Use Camera</span>
                                    </Button>
                                }
                            />
                        </>
                    )}
                 </div>
            </header>
           

            {isLoading ? (
                <div className="flex-1 p-4 md:p-8 overflow-auto">
                    <div className="grid gap-4 grid-cols-2 xl:grid-cols-4 mb-8">
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                        <Skeleton className="h-32 rounded-lg" />
                    </div>
                    <div className="grid gap-8 lg:grid-cols-5">
                        <Skeleton className="h-80 rounded-lg lg:col-span-3" />
                        <Skeleton className="h-80 rounded-lg lg:col-span-2" />
                    </div>
                </div>
            ) : (
              <>
                <div className={cn("overflow-auto", activePage !== 'chat' ? "p-4 md:p-8" : "h-full")}>
                  {renderActivePage()}
                </div>
              </>
            )}
          </main>
        </div>
      </SidebarProvider>
  );
}
