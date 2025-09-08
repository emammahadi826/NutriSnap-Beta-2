
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

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
        <div className="flex items-center justify-between p-4 rounded-lg bg-card border">
            <Label htmlFor="theme-switch" className="flex items-center gap-3">
                <Sun className="h-5 w-5" />
                <span className="font-semibold">Light / Dark Mode</span>
                <Moon className="h-5 w-5" />
            </Label>
            <Switch id="theme-switch" />
        </div>
    );
}
