
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, QrCode } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfilePage() {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
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
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-primary rounded-full">
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
    );
}


function ProfilePageSkeleton() {
    return (
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-5 w-56" />
                </div>
            </div>
            <Skeleton className="h-8 w-8" />
        </div>
    )
}
