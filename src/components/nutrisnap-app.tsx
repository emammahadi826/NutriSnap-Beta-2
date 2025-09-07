
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
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';
import { ChatPage } from './chat-page';
import { cn } from '@/lib/utils';
import { MealLogDialog } from './meal-log-dialog';
import { SettingsPage } from '@/components/settings/settings-page';
import { ClientOnly } from './client-only';
import { ReportPage } from './report/report-page';

const AnalyticsIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M4.5 15.5V10.75C4.5 10.4572 4.24279 10.2 3.95 10.2C3.65721 10.2 3.4 10.4572 3.4 10.75V15.5C3.4 16.9652 4.53482 18.1 6 18.1H20C20.3444 18.1 20.6 17.8444 20.6 17.5C20.6 17.1556 20.3444 16.9 20 16.9H6C5.17157 16.9 4.5 16.2284 4.5 15.5Z" />
        <path d="M7.6 16.9V12.15C7.6 11.8572 7.34279 11.6 7.05 11.6C6.75721 11.6 6.5 11.8572 6.5 12.15V16.9H7.6Z" />
        <path d="M12.1 16.9V7.95C12.1 7.65721 11.8428 7.4 11.55 7.4C11.2572 7.4 11 7.65721 11 7.95V16.9H12.1Z" />
        <path d="M16.6 16.9V10.2C16.6 9.90721 16.3428 9.65 16.05 9.65C15.7572 9.65 15.5 9.90721 15.5 10.2V16.9H16.6Z" />
        <path d="M19.1648 4.43555C19.4939 4.10649 20.0356 4.10649 20.3647 4.43555L22.0647 6.13555C22.3938 6.4646 22.3938 7.00633 22.0647 7.33539C21.7357 7.66444 21.1939 7.66444 20.8649 7.33539L19.55 6.0205L15.3852 10.1853C15.0561 10.5144 14.5144 10.5144 14.1854 10.1853C13.8563 9.85627 13.8563 9.31454 14.1854 8.98549L18.3501 4.8207L17.0353 3.50587C16.7062 3.17681 16.7062 2.63508 17.0353 2.30603C17.3643 1.97697 17.9061 1.97697 18.2351 2.30603L19.1648 3.23567V3.23567L19.55 3.6205L19.1648 4.43555Z" />
    </svg>
);


export function NutriSnapApp() {
  const { isLoaded, meals, guestMealCount, addMeal } = useMealLogger();
  const { user, userProfile, logOut, loading: authLoading } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();
  const [activePage, setActivePage] = useState<'home' | 'chat' | 'settings' | 'report'>('home');
  const GUEST_LIMIT = 3;
  
  const isLoading = authLoading || !isLoaded;

  const AppSidebar = () => {
    const { openMobile, setOpenMobile, state } = useSidebar();
  
    const handleMenuItemClick = (page: 'home' | 'chat' | 'settings' | 'report') => {
        setActivePage(page);
        if (isMobile) {
            setOpenMobile(false);
        }
    }

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
                    <AnalyticsIcon className="h-6 w-6"/>
                    <span className={cn(state === 'collapsed' && 'hidden')}>Report</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <ClientOnly>
            <div className={cn("flex flex-col gap-4", state === 'collapsed' && 'p-2 items-center')}>
              {isGuest && (
                <div className={cn("p-3 rounded-lg bg-sidebar-accent/20 border border-sidebar-border", state === 'collapsed' && 'hidden')}>
                    <div className="text-center text-sm mb-2">
                        <p className="font-bold">{GUEST_LIMIT - guestMealCount} credits left</p>
                        <p className="text-xs text-muted-foreground">Log in for unlimited meals.</p>
                    </div>
                  <Progress value={((GUEST_LIMIT - guestMealCount) / GUEST_LIMIT) * 100} className="h-2 bg-sidebar-accent/20" />
                </div>
              )}
              
              <div className={cn(state === 'collapsed' ? 'hidden' : 'block')}>
                  <SidebarSeparator />
              </div>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={cn("flex items-center w-full h-12 p-2 gap-2", state === 'expanded' ? 'justify-start' : 'justify-center')}>
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                        <AvatarFallback className="rounded-lg">
                          {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <UserIcon />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("flex-1 flex items-center justify-between", state === 'collapsed' && 'hidden')}>
                          <span className="truncate ml-1">{userProfile?.displayName || user.email}</span>
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
          <SheetContent side="left" className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground flex flex-col border-r" style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
             
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
                        <AnalyticsIcon className="h-6 w-6"/>
                        <span className="truncate">Report</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <ClientOnly>
                  <div className="flex flex-col gap-4">
                      {isGuest && (
                          <div className="p-3 rounded-lg bg-sidebar-accent/20 border border-sidebar-border">
                              <div className="text-center text-sm mb-2">
                                  <p className="font-bold">{GUEST_LIMIT - guestMealCount} credits left</p>
                                  <p className="text-xs text-muted-foreground">Log in for unlimited meals.</p>
                              </div>
                          <Progress value={((GUEST_LIMIT - guestMealCount) / GUEST_LIMIT) * 100} className="h-2 bg-sidebar-accent/20" />
                          </div>
                      )}
                      <SidebarSeparator />

                      {user ? (
                          <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className={cn("flex items-center w-full h-12 p-2 gap-2", "justify-start")}>
                              <Avatar className="h-8 w-8 rounded-lg">
                                  <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                                  <AvatarFallback className="rounded-lg">
                                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <UserIcon />}
                                  </AvatarFallback>
                              </Avatar>
                              <div className={cn("flex-1 flex items-center justify-between")}>
                                  <span className="truncate ml-1">{userProfile?.displayName || user.email}</span>
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

  const summary = useMealLogger().getTodaysSummary();
  
  const renderActivePage = () => {
    switch (activePage) {
        case 'home':
            return <Dashboard meals={meals} summary={summary} />;
        case 'chat':
            return <ChatPage />;
        case 'settings':
            return <SettingsPage onBack={() => setActivePage('home')} />;
        case 'report':
            return <ReportPage />;
        default:
            return <Dashboard meals={meals} summary={summary} />;
    }
  }


  return (
      <SidebarProvider>
         <div className="flex h-screen bg-background">
          <AppSidebar />
           <main className="flex-1 flex flex-col">
            
            <header className="flex h-[69px] items-center px-4 border-b">
                <SidebarTrigger />
                <div className="ml-auto flex items-center gap-2">
                    <MealLogDialog
                        onMealLog={addMeal}
                        isGuest={isGuest}
                        guestMealCount={guestMealCount}
                        trigger={
                            <Button variant="ghost" size="icon">
                                <Upload className="h-5 w-5" />
                                <span className="sr-only">Upload Meal</span>
                            </Button>
                        }
                    />
                    <MealLogDialog
                        onMealLog={addMeal}
                        isGuest={isGuest}
                        guestMealCount={guestMealCount}
                        startWithCamera={true}
                        trigger={
                            <Button variant="ghost" size="icon">
                                <Camera className="h-5 w-5" />
                                <span className="sr-only">Use Camera</span>
                            </Button>
                        }
                    />
                </div>
            </header>

            {isLoading ? (
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
            ) : (
              <>
                <div className={cn("overflow-auto", activePage !== 'chat' ? "p-4 md:p-8" : "h-[calc(100vh-69px)]")}>
                  {renderActivePage()}
                </div>
              </>
            )}
          </main>
        </div>
      </SidebarProvider>
  );
}
