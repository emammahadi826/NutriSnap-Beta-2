
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { Dashboard } from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Button } from './ui/button';
import Link from 'next/link';
import { LogOut, LogIn, Home, User as UserIcon, ChevronUp, MessageCircle, Upload, Camera, Settings } from 'lucide-react';
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
import { useState } from 'react';
import { ChatPage } from './chat-page';
import { cn } from '@/lib/utils';
import { MealLogDialog } from './meal-log-dialog';


export function NutriSnapApp() {
  const { isLoaded, meals, guestMealCount, addMeal } = useMealLogger();
  const { user, userProfile, logOut, loading: authLoading } = useAuth();
  const isGuest = !user;
  const isMobile = useIsMobile();
  const [activePage, setActivePage] = useState<'home' | 'chat'>('home');
  const GUEST_LIMIT = 3;
  
  const isLoading = authLoading || !isLoaded;

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
        <SidebarContent className="flex flex-col">
          <SidebarMenu className="flex-1">
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => { setActivePage('home'); if (isMobile) setOpenMobile(false); }} isActive={activePage === 'home'} variant={'outline'} size="lg" className="h-12">
                <Home className="h-6 w-6"/>
                <span className={cn(state === 'collapsed' && 'hidden')}>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <SidebarMenuButton onClick={() => { setActivePage('chat'); if (isMobile) setOpenMobile(false); }} isActive={activePage === 'chat'} variant={'outline'} size="lg" className="h-12">
                    <MessageCircle className="h-6 w-6"/>
                    <span className={cn(state === 'collapsed' && 'hidden')}>Chat</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem className="mt-auto">
                <SidebarMenuButton variant={'outline'} size="lg" className="h-12 w-full">
                    <Settings className="h-6 w-6"/>
                    <span className={cn(state === 'collapsed' && 'hidden', "truncate")}>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className={cn("flex flex-col gap-4", state === 'collapsed' && 'hidden')}>
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
                  <Button variant="ghost" className="flex items-center justify-start w-full h-12 p-2 gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                      <AvatarFallback>
                        {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <UserIcon />}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{userProfile?.displayName || user.email}</span>
                    <ChevronUp className="ml-auto h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
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
            <SidebarContent className="flex flex-col">
              <SidebarMenu className="flex-1">
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
                 <SidebarMenuItem className="mt-auto">
                    <SidebarMenuButton variant={'outline'} size="lg" className="h-12 w-full">
                        <Settings className="h-6 w-6"/>
                        <span className="truncate">Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
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
                            <Button variant="ghost" className="flex items-center justify-start w-full h-12 p-2 gap-2">
                            <Avatar className="h-7 w-7">
                                <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                                <AvatarFallback>
                                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <UserIcon />}
                                </AvatarFallback>
                            </Avatar>
                            <span className="truncate">{userProfile?.displayName || user.email}</span>
                            <ChevronUp className="ml-auto h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            side="top"
                            className="w-[--radix-popper-anchor-width]"
                        >
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
                <div className={cn("overflow-auto", activePage === 'home' ? "p-4 md:p-8" : "h-[calc(100vh-69px)]")}>
                  {activePage === 'home' ? (
                    <Dashboard 
                        meals={meals} 
                        summary={summary}
                    />
                  ) : (
                    <ChatPage />
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </SidebarProvider>
  );
}
