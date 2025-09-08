
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Link as LinkIcon, ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function SettingsPage() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    if (!mounted) {
        // Prevent hydration mismatch by not rendering the switch until the client has mounted
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background border">
                 <div className="flex items-center justify-between">
                    <Label htmlFor="theme-switch" className="flex items-center gap-3 cursor-pointer">
                        <Sun className="h-5 w-5" />
                        <span className="font-semibold">Light / Dark Mode</span>
                        <Moon className="h-5 w-5" />
                    </Label>
                    <Switch
                        id="theme-switch"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </div>
            </div>
            <div className="p-4 rounded-lg bg-background border">
                 <button className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                        <LinkIcon className="h-5 w-5" />
                        <span className="font-semibold">Link device</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
            </div>
        </div>
    );
}
