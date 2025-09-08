
"use client";

import { useAuth } from "@/hooks/use-auth";

export function SettingsPage() {
    const { user } = useAuth();

     if (!user) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-xl font-semibold">Please log in</h2>
                <p className="text-muted-foreground mt-2">
                    You need to be logged in to view settings.
                </p>
            </div>
        )
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and application settings.</p>
            </header>
            <div className="flex flex-col items-center justify-center text-center p-16 border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold">Settings Under Construction</h2>
                <p className="text-muted-foreground mt-2">
                    This page will soon hold your notification, theme, and data preferences.
                </p>
            </div>
        </div>
    );
}
