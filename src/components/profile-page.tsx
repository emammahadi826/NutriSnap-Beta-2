
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

export function ProfilePage() {
    const { user, userProfile, loading } = useAuth();

    if (loading) {
        return <ProfilePageSkeleton />;
    }

    if (!user) {
        return (
            <div className="space-y-8">
                 <header className="mb-8">
                    <h1 className="text-3xl font-bold">User Profile</h1>
                    <p className="text-muted-foreground">View your profile information below.</p>
                </header>
                <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-card">
                    <h2 className="text-xl font-semibold">Please log in</h2>
                    <p className="text-muted-foreground mt-2">
                        You need to be logged in to view your profile.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-muted-foreground">View and manage your profile information.</p>
            </header>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-8 border rounded-lg bg-card">
                 <Avatar className="h-24 w-24 border-2 border-primary rounded-full">
                    <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                    <AvatarFallback className="text-3xl rounded-full">
                        {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <User />}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold">{userProfile?.displayName || 'User'}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>

            {/* Other profile sections can be added here in the future */}
             <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-card">
                <h2 className="text-xl font-semibold">Under Construction</h2>
                <p className="text-muted-foreground mt-2">
                    More profile details and settings will be available here soon!
                </p>
            </div>
        </div>
    );
}


function ProfilePageSkeleton() {
    return (
         <div className="space-y-8">
            <header className="mb-8">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-5 w-80 mt-2" />
            </header>

            <div className="flex items-center space-x-6 p-8 border rounded-lg bg-card">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-7 w-40" />
                    <Skeleton className="h-5 w-56" />
                </div>
            </div>
             <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-card">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-72 mt-2" />
            </div>
        </div>
    )
}
