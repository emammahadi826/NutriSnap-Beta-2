
"use client";

import { Button } from "@/components/ui/button";
import { Flame, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#E9E4F0] to-[#D3CCE3] dark:from-[#1a1c29] dark:to-[#2a2c41] text-foreground">
            <header className="p-4 sm:p-6">
                 <div className="flex items-center gap-2">
                    <Flame className="w-7 h-7 text-primary" />
                    <h1 className="text-xl font-bold font-headline">NutriSnap</h1>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                 <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8 text-center lg:text-left">
                    {/* Text Content */}
                    <div className="space-y-6 relative">
                        <Sparkles className="h-6 w-6 text-purple-400 absolute -top-12 left-1/4" />
                        <Sparkles className="h-4 w-4 text-purple-300 absolute -bottom-12 right-1/4" />
                        <h2 className="text-4xl md:text-6xl font-bold !leading-tight">
                            Your Smart <br/> Nutrition Companion
                        </h2>
                        <p className="max-w-md mx-auto lg:mx-0 text-lg text-muted-foreground">
                            From quick snacks to full meals, NutriSnap is the only AI-powered assistant that helps you track your diet and achieve your health goals.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                           <Button asChild size="lg" className="h-12 px-8 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition-transform hover:scale-105">
                                <Link href="/login">Get Started <ChevronRight className="h-5 w-5 ml-1" /></Link>
                            </Button>
                             <p className="text-sm text-muted-foreground">
                                Already have an account? <Link href="/login" className="underline hover:text-primary">Log In</Link>
                            </p>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="relative w-full max-w-md mx-auto aspect-square hidden lg:flex items-center justify-center">
                         <div className="absolute inset-0 bg-purple-300/30 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
                         <Sparkles className="h-8 w-8 text-purple-400 absolute top-8 right-8" />
                         <Sparkles className="h-5 w-5 text-purple-400 absolute bottom-8 left-8" />
                         <Image
                            src="https://picsum.photos/seed/nutrisnap-hero/600/600"
                            alt="A healthy and vibrant meal"
                            width={500}
                            height={500}
                            className="object-cover rounded-full shadow-2xl z-10"
                            data-ai-hint="healthy food"
                        />
                    </div>
                </div>
            </main>

            <footer className="p-4 sm:p-6 text-center text-xs text-muted-foreground">
                 <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
            </footer>
        </div>
    )
}
