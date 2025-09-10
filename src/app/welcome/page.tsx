
"use client";

import { Button } from "@/components/ui/button";
import { Flame, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
    return (
        <div 
            className="relative flex flex-col min-h-screen text-foreground bg-gradient-to-br from-purple-100/50 via-white to-blue-100/50 dark:from-gray-900 dark:via-black dark:to-purple-900/50"
        >
            <div className="absolute inset-0 z-0 opacity-50">
                 {/* Decorative shapes can be added here if needed */}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1">
                <header className="p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                        <Flame className="w-7 h-7 text-primary" />
                        <h1 className="text-xl font-bold font-headline">NutriSnap</h1>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="space-y-8 relative">
                        <div className="relative">
                            <Sparkles className="h-6 w-6 text-purple-400 absolute -top-12 left-1/4" />
                            <Sparkles className="h-4 w-4 text-purple-300 absolute -bottom-12 right-1/4" />
                             <h2 className="text-5xl md:text-7xl font-bold !leading-tight text-foreground">
                                Snap, Track, <br/> & Thrive
                            </h2>
                        </div>
                        <p className="max-w-md text-lg text-muted-foreground">
                           Your AI-powered nutrition coach. Instantly identify food from a photo, track your macros, and get personalized health advice to reach your goals faster.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4">
                            <Button asChild size="lg" className="h-12 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-transform hover:scale-105">
                                <Link href="/login">Get Started <ChevronRight className="h-5 w-5 ml-1" /></Link>
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                Already have an account? <Link href="/login" className="underline hover:text-primary">Log In</Link>
                            </p>
                        </div>
                    </div>
                </main>

                <footer className="p-4 sm:p-6 text-center text-xs text-muted-foreground">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </footer>
            </div>
        </div>
    )
}
