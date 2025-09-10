
"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Flame, Eye, EyeOff, Loader2, QrCode, Camera, Upload, User, Mail, X, Sparkles, Circle, Square } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Html5Qrcode, Html5QrcodeError, Html5QrcodeResult } from 'html5-qrcode';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { logIn, signInWithGoogle, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scannedEmail, setScannedEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const scanProcessedRef = useRef(false);
  
  const handleScanSuccess = async (decodedText: string) => {
      if (scanProcessedRef.current) return;
      scanProcessedRef.current = true;

      stopScanning();
      try {
          const { email: qrEmail } = JSON.parse(decodedText);
          if (qrEmail && typeof qrEmail === 'string') {
              toast({ title: "QR Code Scanned!", description: "Please enter your password to continue." });
              setEmail(qrEmail);
              setScannedEmail(qrEmail); // Lock the email field
              setIsSignUp(false);
              // Focus the password input after a short delay
              setTimeout(() => passwordInputRef.current?.focus(), 100);
          } else {
              throw new Error("Invalid QR code format.");
          }
      } catch (error) {
          toast({ variant: 'destructive', title: "Scan Error", description: "The QR code is not valid for NutriSnap." });
          setScannedEmail(null);
      } finally {
          setIsScannerOpen(false);
      }
  };
  
  const startScanning = async () => {
    setScanError(null);
    scanProcessedRef.current = false; // Reset scan processed flag

    // Wait a moment for the dialog to render the element
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!document.getElementById('qr-reader-login')) {
        console.error("QR reader element not found after delay.");
        setScanError("Could not initialize the scanner. Please close and re-open the dialog.");
        return;
    }
    
    const qrCodeSuccessCallback = (decodedText: string, result: Html5QrcodeResult) => {
        handleScanSuccess(decodedText);
    };
    const qrCodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) => {
        // We can ignore most errors as they fire continuously.
    };

    try {
        if (!html5QrCodeRef.current) {
            html5QrCodeRef.current = new (await import('html5-qrcode')).Html5Qrcode('qr-reader-login');
        }
        
        await html5QrCodeRef.current.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            qrCodeSuccessCallback,
            qrCodeErrorCallback
        );
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
            if (!html5QrCodeRef.current) {
                html5QrCodeRef.current = new (await import('html5-qrcode')).Html5Qrcode('qr-reader-login');
            }
            const decodedText = await html5QrCodeRef.current.scanFile(file, false);
            handleScanSuccess(decodedText);
        } catch (err: any) {
            console.error(`Error scanning file. ${err}`);
            setScanError("Could not read a QR code from the uploaded image.");
        }
    }
  };

  useEffect(() => {
    if (!isScannerOpen) {
        stopScanning();
    }
    return () => {
        stopScanning();
    }
  }, [isScannerOpen]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isSignUp) {
      if (password !== confirmPassword) {
        toast({ variant: 'destructive', title: 'Sign-up failed', description: "Passwords do not match." });
        setIsSubmitting(false);
        return;
      }
      const params = new URLSearchParams();
      params.set('email', email);
      params.set('password', password);
      router.push(`/complete-profile?${params.toString()}`);
    } else {
      const success = await logIn(email, password);
      if (success) {
        router.push('/');
      } else {
        const currentError = error; 
        if (currentError === 'auth/user-not-found' || currentError === 'auth/invalid-credential') {
            toast({ variant: 'destructive', title: 'Login Failed', description: "Invalid email or password." });
        } else {
            toast({ variant: 'destructive', title: 'Login failed', description: currentError || "An unknown error occurred." });
        }
        setIsSubmitting(false);
      }
    }
  };
  
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setScannedEmail(null); // Reset scanned email when toggling
  }

  const handleScannerOpen = (open: boolean) => {
      setIsScannerOpen(open);
      if (open) {
        setScanError(null);
        setHasCameraPermission(null);
        scanProcessedRef.current = false;
      }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100/50 via-white to-blue-100/50 dark:from-gray-900 dark:via-black dark:to-purple-900/50 p-4 sm:p-6 md:p-8 text-foreground overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-50">
            <Sparkles className="h-4 w-4 text-purple-300 absolute top-[10%] left-[5%]" />
            <Sparkles className="h-6 w-6 text-blue-300 absolute top-[20%] right-[10%]" />
            <Sparkles className="h-5 w-5 text-purple-400 absolute bottom-[15%] left-[15%]" />
            <Sparkles className="h-4 w-4 text-blue-200 absolute bottom-[10%] right-[5%]" />
            <Sparkles className="h-8 w-8 text-purple-200 absolute top-[40%] left-[20%]" />
            <Sparkles className="h-5 w-5 text-blue-400 absolute top-[50%] right-[30%]" />
            <Sparkles className="h-6 w-6 text-blue-200 absolute bottom-[25%] right-[20%]" />
            <Circle className="h-6 w-6 text-blue-200 absolute top-[5%] right-[30%]" />
            <Square className="h-4 w-4 text-purple-300 absolute top-[15%] left-[45%]" />
            <Circle className="h-8 w-8 text-purple-400 absolute bottom-[5%] left-[25%]" />
            <Square className="h-5 w-5 text-blue-300 absolute bottom-[40%] right-[15%]" />
        </div>
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Flame className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline">NutriSnap</h1>
        </div>
        <Card className={cn(
            "w-full max-w-sm border-border/50 bg-card/80 dark:bg-card/50 backdrop-blur-sm transition-all duration-300 ease-in-out",
            isSignUp ? "min-h-[550px]" : "min-h-[480px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            )}>
            <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
                {isSignUp ? 'Create an account' : (scannedEmail ? `Welcome Back!` : 'Welcome back')}
            </CardTitle>
            <CardDescription>
                {isSignUp
                ? 'Enter your details to get started'
                : (scannedEmail ? 'Enter your password to log in.' : 'Log in to access your account')}
            </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                {scannedEmail ? (
                    <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 dark:bg-muted/30 border">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 font-semibold truncate">{scannedEmail}</div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setScannedEmail(null); setEmail(''); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    !isSignUp && (
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="m@example.com" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                className="bg-background/50 dark:bg-background/30"
                                disabled={!!scannedEmail}
                            />
                        </div>
                    )
                )}
                {!isSignUp && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            {!isSignUp && (
                                <Link href="#" className="text-xs text-primary/80 hover:text-primary hover:underline">
                                    Forgot your password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <Input 
                            id="password" 
                            ref={passwordInputRef}
                            type={showPassword ? "text" : "password"} 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-background/50 dark:bg-background/30 pr-10"
                            />
                            <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(prev => !prev)}
                            >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                )}
                {isSignUp && (
                <>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="m@example.com" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="bg-background/50 dark:bg-background/30"
                    />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-background/50 dark:bg-background/30 pr-10"
                            />
                            <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                            onClick={() => setShowPassword(prev => !prev)}
                            >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                            <Input 
                                id="confirm-password" 
                                type={showConfirmPassword ? "text" : "password"} 
                                required 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-background/50 dark:bg-background/30 pr-10"
                            />
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon"
                                className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                    </div>
                </>
                )}
                <Button type="submit" className="w-full h-10 font-semibold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Sign Up' : 'Login')}
                </Button>

                {!scannedEmail && (
                    <>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/50" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card/80 dark:bg-card/50 backdrop-blur-sm px-2 text-muted-foreground">
                                Or continue with
                                </span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <Button 
                                variant="outline" 
                                className="w-full" 
                                type="button" 
                                disabled={isSubmitting}
                                onClick={async () => {
                                    setIsSubmitting(true);
                                    const success = await signInWithGoogle();
                                    if (!success) {
                                        setIsSubmitting(false);
                                    }
                                }}
                                >
                                {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                                Google
                            </Button>
                            <Dialog open={isScannerOpen} onOpenChange={handleScannerOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full" type="button" disabled={isSubmitting}>
                                        <QrCode className="mr-2 h-4 w-4" />
                                        Scan QR
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-[95vw] sm:max-w-sm">
                                    <DialogHeader>
                                        <DialogTitle>Scan to Login</DialogTitle>
                                        <DialogDescription>
                                            Point your camera at a NutriSnap QR code to log in instantly.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div id="qr-reader-login" className="w-full rounded-lg overflow-hidden aspect-square bg-muted"></div>
                                        
                                        {scanError && (
                                                <Alert variant="destructive">
                                                <AlertTitle>Scan Error</AlertTitle>
                                                <AlertDescription>{scanError}</AlertDescription>
                                            </Alert>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                                <Button onClick={startScanning} variant="outline" disabled={hasCameraPermission === false}>
                                                <Camera className="mr-2 h-4 w-4" />
                                                Scan
                                                </Button>
                                                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload
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
                                </DialogContent>
                            </Dialog>
                        </div>
                    </>
                )}
            </CardContent>
            </form>
            {!scannedEmail && (
                <CardFooter className="flex justify-center text-sm">
                    <p className="text-muted-foreground">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <Button variant="link" className="p-1" onClick={toggleForm}>
                            {isSignUp ? 'Login' : 'Sign up'}
                        </Button>
                    </p>
                </CardFooter>
            )}
        </Card>
        <p className="px-4 sm:px-8 text-center text-xs text-muted-foreground mt-8 max-w-sm">
            By clicking continue, you agree to our{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
            </Link>
            .
        </p>
      </div>
    </div>
  );
}

    
