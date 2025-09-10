
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Link as LinkIcon, ChevronRight, Loader2, User, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import type { Html5Qrcode, Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Input } from '../ui/input';

export function SettingsPage() {
    const { user, logOut, logIn, error } = useAuth();
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isLinking, setIsLinking] = useState(false);
    const [scanError, setScanError] = useState<string | null>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [scannedEmail, setScannedEmail] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleScanSuccess = async (decodedText: string) => {
        stopScanning();
        try {
            const { email: qrEmail } = JSON.parse(decodedText);
            if (qrEmail && typeof qrEmail === 'string') {
                if (qrEmail === user?.email) {
                    toast({ variant: 'default', title: "Already Logged In", description: "You are already logged into this account." });
                    setIsScannerOpen(false);
                    return;
                }
                toast({ title: "Account Scanned!", description: `Enter password for ${qrEmail} to switch.` });
                setScannedEmail(qrEmail);
                // Focus the password input after a short delay
                setTimeout(() => passwordInputRef.current?.focus(), 100);
            } else {
                throw new Error("Invalid QR code format.");
            }
        } catch (error) {
            toast({ variant: 'destructive', title: "Scan Error", description: "The QR code is not valid for NutriSnap." });
            setScannedEmail(null);
        }
    };

    const handleAccountSwitch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!scannedEmail || !password) return;

        setIsLinking(true);
        await logOut(true); // Log out of the current account without redirecting
        
        const success = await logIn(scannedEmail, password);

        if (success) {
            toast({ title: "Account Switched!", description: `Successfully logged in as ${scannedEmail}`, className: "bg-primary text-primary-foreground" });
            router.push('/'); // Redirect to dashboard after successful login
        } else {
             toast({ variant: 'destructive', title: "Login Failed", description: "Could not sign in with the scanned account. Please check the password and try again." });
             // If login fails, the user is already logged out, so redirect to login page
             router.push('/login');
        }
        
        setIsLinking(false);
        setIsScannerOpen(false);
        setScannedEmail(null);
        setPassword('');
    };
  
    const startScanning = async () => {
        setScanError(null);
        const qrCodeSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
            handleScanSuccess(decodedText);
        };
        const qrCodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {};

        try {
            if (!html5QrCodeRef.current) return;
            await html5QrCodeRef.current.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, qrCodeSuccessCallback, qrCodeErrorCallback);
            setHasCameraPermission(true);
        } catch (err: any) {
            console.error("Failed to start camera.", err);
            setHasCameraPermission(false);
            setScanError("Could not start camera. Please grant permission and try again.");
        }
    };
  
    const stopScanning = async () => {
        try {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                await html5QrCodeRef.current.stop();
            }
        } catch (err) {
            console.error("Failed to stop scanning.", err);
        }
    };
  
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            try {
                if (!html5QrCodeRef.current) return;
                const decodedText = await html5QrCodeRef.current.scanFile(file, false);
                handleScanSuccess(decodedText);
            } catch (err: any) {
                console.error(`Error scanning file. ${err}`);
                setScanError("Could not read a QR code from the uploaded image.");
            }
        }
    };

    useEffect(() => {
        if (isScannerOpen) {
            import('html5-qrcode').then(module => {
                if (!html5QrCodeRef.current) {
                    html5QrCodeRef.current = new module.Html5Qrcode('qr-reader-settings');
                }
            });
        } else {
            stopScanning().then(() => {
                html5QrCodeRef.current = null;
            });
        }
        return () => { stopScanning(); }
    }, [isScannerOpen]);


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
        return null;
    }
    
    const handleScannerOpenChange = (open: boolean) => {
        setIsScannerOpen(open);
        if (!open) {
            // Reset state when dialog is closed
            setScannedEmail(null);
            setPassword('');
            setScanError(null);
            setHasCameraPermission(null);
            setIsLinking(false);
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

            <Dialog open={isScannerOpen} onOpenChange={handleScannerOpenChange}>
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
                        <DialogTitle>Switch Account</DialogTitle>
                        <DialogDescription>
                           {scannedEmail ? `Enter password to switch to ${scannedEmail}.` : "Scan another user's QR code to log into their account."}
                        </DialogDescription>
                    </DialogHeader>

                    {isLinking ? (
                         <div className="flex flex-col items-center justify-center h-64">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-4 text-muted-foreground">Switching account...</p>
                        </div>
                    ) : scannedEmail ? (
                        <form onSubmit={handleAccountSwitch} className="space-y-4">
                             <div className="flex items-center gap-3 p-3 rounded-md bg-muted border">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1 font-semibold truncate">{scannedEmail}</div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="switch-password">Password</Label>
                                <Input 
                                    id="switch-password"
                                    ref={passwordInputRef}
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Switch Account</Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div id="qr-reader-settings" className="w-full rounded-lg overflow-hidden aspect-square bg-muted"></div>
                             {scanError && (
                                <Alert variant="destructive">
                                <AlertTitle>Scan Error</AlertTitle>
                                <AlertDescription>{scanError}</AlertDescription>
                                </Alert>
                            )}
                             <div className="grid grid-cols-2 gap-2">
                                <Button onClick={startScanning} variant="outline" disabled={hasCameraPermission === false}>
                                    <Camera className="mr-2 h-4 w-4" /> Scan
                                </Button>
                                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                                    <ChevronRight className="mr-2 h-4 w-4" /> Upload
                                </Button>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/gif"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

    