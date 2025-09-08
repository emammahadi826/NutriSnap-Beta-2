
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, QrCode, Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Separator } from './ui/separator';

export function ProfilePage() {
    const { user, userProfile, loading: authLoading, updateUserProfile } = useAuth();
    
    if (authLoading) {
        return <ProfilePageSkeleton />;
    }

    if (!user) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-xl font-semibold">Please log in</h2>
                <p className="text-muted-foreground mt-2">
                    You need to be logged in to view your profile.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 rounded-full">
                        <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                        <AvatarFallback className="text-3xl">
                            {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <User />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <h2 className="text-2xl font-bold">{userProfile?.displayName || 'User'}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <QrCode className="h-8 w-8 text-muted-foreground" />
            </div>

            <Separator />
            
            {/* The form is now in settings-page.tsx */}
            <div>
              <h3 className="text-lg font-medium">Profile Details</h3>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <p><strong>Gender:</strong> {userProfile?.gender || 'Not set'}</p>
                <p><strong>Age:</strong> {userProfile?.age || 'Not set'}</p>
                <p><strong>Weight:</strong> {userProfile?.weight ? `${userProfile.weight} kg` : 'Not set'}</p>
                <p><strong>Height:</strong> {userProfile?.height ? `${(userProfile.height / 100).toFixed(2)} m` : 'Not set'}</p>
              </div>
            </div>
        </div>
    );
}


function ProfilePageSkeleton() {
    return (
         <div className="space-y-8">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-5 w-56" />
                    </div>
                </div>
                <Skeleton className="h-8 w-8" />
            </div>
            <Separator />
            <div className="space-y-8 max-w-2xl">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <Skeleton className="h-11 w-32" />
            </div>
        </div>
    )
}
