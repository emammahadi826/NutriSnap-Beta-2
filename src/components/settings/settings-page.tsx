
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
    const [isScannerInitializing, setIsScannerInitializing] = useState(true);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let scanner: any;
        if (isScannerOpen && !isScannerInitializing) {
            // Dynamically import the library only on the client-side
            import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
                scanner = new Html5QrcodeScanner(
                    "qr-reader-settings",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    false // verbose
                );

                const onScanSuccess = async (decodedText: string) => {
                    scanner.clear();
                    setIsLinking(true);
                    try {
                        const { uid } = JSON.parse(decodedText);
                        if (uid) {
                            toast({ title: "QR Code Scanned!", description: "Attempting to link device..." });
                            // Log out of current account without redirecting
                            if (logOut) await logOut(true); 
                            // Sign in with the new account's UID
                            const success = await signInWithCustomToken(uid);
                            if(success) {
                                toast({ title: "Account Switched Successfully!", className: "bg-primary text-primary-foreground" });
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
                    // Ignore frequent "no QR code found" errors
                };

                scanner.render(onScanSuccess, onScanFailure);

            }).catch(err => {
                console.error("Failed to load Html5QrcodeScanner", err);
                toast({ variant: 'destructive', title: "Scanner Error", description: "Could not initialize the QR code scanner." });
                setIsScannerInitializing(true);
            });
        }

        return () => {
            if (scanner && scanner.getState() !== 3 /* SCANNING_STATE.NOT_STARTED */) {
                scanner.clear().catch((error: any) => {
                    console.error("Failed to clear scanner on unmount", error);
                });
            }
        };
    }, [isScannerOpen, isScannerInitializing, toast, logOut, signInWithCustomToken, router]);


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
    
    const handleScannerOpen = (open: boolean) => {
        setIsScannerOpen(open);
        if (open) {
            setIsScannerInitializing(false);
        }
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

            <Dialog open={isScannerOpen} onOpenChange={handleScannerOpen}>
                <DialogTrigger asChild>
                    <button className="flex items-center justify-between w-full p-4 rounded-lg bg-background border cursor-pointer">
                        <div className="flex items-center gap-3">
                            <LinkIcon className="h-5 w-5" />
                            <span className="font-semibold">Link device / Switch account</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Scan QR Code</DialogTitle>
                        <DialogDescription>
                            Point your camera at the QR code displayed on another device to switch accounts.
                        </DialogDescription>
                    </DialogHeader>
                    {isLinking || isScannerInitializing ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">
                                {isLinking ? "Switching account, please wait..." : "Initializing scanner..."}
                            </p>
                        </div>
                    ) : (
                        <div id="qr-reader-settings" className="w-full rounded-lg overflow-hidden"></div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

    

    