
"use client";

import { Suspense } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

function SettingsSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    )
}


export function SettingsPage({ onBack }: { onBack: () => void }) {
    const { user, loading } = useAuth();

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and profile settings.</p>
            </header>

            {loading || !user ? (
                 <SettingsSkeleton />
            ) : (
                <Suspense fallback={<SettingsSkeleton />}>
                    {/* The form is now in ProfilePage.tsx */}
                </Suspense>
            )}
        </div>
    );
}
