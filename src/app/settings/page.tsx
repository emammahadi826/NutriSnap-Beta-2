
"use client";

import { Suspense } from 'react';
import SettingsForm from './settings-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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


export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?redirect=/settings');
        }
    }, [user, loading, router]);


    if (loading || !user) {
        return (
            <div className="p-4 md:p-8">
                 <header className="mb-8">
                     <Button variant="ghost" onClick={() => router.back()} className="mb-4">
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
        <div className="p-4 md:p-8">
            <header className="mb-8 max-w-2xl mx-auto">
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 -ml-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and profile settings.</p>
            </header>
            <Suspense fallback={<SettingsSkeleton />}>
                <SettingsForm />
            </Suspense>
        </div>
    );
}
