
"use client";

import { Suspense } from 'react';
import SettingsForm from './settings-form';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

function SettingsSkeleton() {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
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


export function SettingsPage({ onBack }: { onBack: () => void }) {
    const { user, loading } = useAuth();

    if (loading || !user) {
        return (
            <div>
                 <header className="mb-8">
                     <Button variant="ghost" onClick={onBack} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and profile settings.</p>
                </header>
                <SettingsSkeleton />
            </div>
        )
    }

    return (
        <div>
            <header className="mb-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and profile settings.</p>
            </header>
            <Suspense fallback={<SettingsSkeleton />}>
                <SettingsForm onSaveSuccess={onBack} />
            </Suspense>
        </div>
    );
}

    