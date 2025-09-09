"use client";

import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Link as LinkIcon, ChevronRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Html5QrcodeScanner, Html5QrcodeError, Html5QrcodeResult } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function SettingsPage() {
    const { user, signInWithCustomToken, logOut } = useAuth();
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isLinking, setIsLinking] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isScannerOpen) {
            const scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false // verbose
            );

            const onScanSuccess = async (decodedText: string, decodedResult: Html5QrcodeResult) => {
                scanner.clear();
                setIsLinking(true);
                try {
                    const { uid } = JSON.parse(decodedText);
                    if (uid) {
                        toast({ title: "QR Code Scanned!", description: "Attempting to link device..." });
                        // In a real app, you would securely get a custom token for this UID
                        // For this demo, we are unsafely creating it on the client
                        // This is a major security risk and should NOT be done in production.
                        if (logOut) await logOut(true); // Log out without redirect
                        const success = await signInWithCustomToken(uid);
                        if(success) {
                            toast({ title: "Device Linked Successfully!", className: "bg-primary text-primary-foreground" });
                            router.push('/');
                        } else {
                             toast({ variant: 'destructive', title: "Linking Failed", description: "Could not sign in with the scanned code." });
                        }

                    } else {
                        throw new Error("Invalid QR code format.");
                    }
                } catch (error) {
                    toast({ variant: 'destructive', title: "Scan Error", description: "The QR code is not valid for NutriSnap." });
                } finally {
                    setIsScannerOpen(false);
                    setIsLinking(false);
                }
            };
            
            const onScanFailure = (error: string) => {
                // This will be called frequently, so we don't want to show a toast.
                // console.warn(`QR error = ${error}`);
            };

            scanner.render(onScanSuccess, onScanFailure);

            return () => {
                scanner.clear().catch(error => {
                    console.error("Failed to clear scanner on unmount", error);
                });
            };
        }
    }, [isScannerOpen, toast, logOut, signInWithCustomToken, router]);


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
            <div className="flex items-center justify-between p-4 rounded-lg bg-background border">
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

            <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
                <DialogTrigger asChild>
                    <div className="p-4 rounded-lg bg-background border cursor-pointer">
                         <button className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <LinkIcon className="h-5 w-5" />
                                <span className="font-semibold">Link device</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </button>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Scan QR Code</DialogTitle>
                        <DialogDescription>
                            Point your camera at the QR code displayed on another device to link your account.
                        </DialogDescription>
                    </DialogHeader>
                    {isLinking ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Linking device, please wait...</p>
                        </div>
                    ) : (
                        <div id="qr-reader" className="w-full"></div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
