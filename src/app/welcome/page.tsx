
"use client";

import { Button } from "@/components/ui/button";
import { Flame, ChevronRight, Sparkles, Zap, BarChart, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WelcomePage() {
    return (
        <div 
            className="relative flex flex-col min-h-screen text-foreground bg-gradient-to-br from-purple-100/50 via-white to-blue-100/50 dark:from-gray-900 dark:via-black dark:to-purple-900/50 overflow-x-hidden"
        >
            <div className="absolute inset-0 z-0 opacity-50">
                 <Sparkles className="h-4 w-4 text-purple-300 absolute top-[10%] left-[5%]" />
                 <Sparkles className="h-6 w-6 text-blue-300 absolute top-[20%] right-[10%]" />
                 <Sparkles className="h-5 w-5 text-purple-400 absolute bottom-[15%] left-[15%]" />
                 <Sparkles className="h-4 w-4 text-blue-200 absolute bottom-[10%] right-[5%]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1">
                <header className="p-4 sm:p-6 flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Flame className="w-7 h-7 text-primary" />
                        <h1 className="text-xl font-bold font-headline">NutriSnap</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
                        <Link href="#" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Features</Link>
                        <Link href="#" className="hover:text-primary transition-colors">About</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
                    </nav>
                    <div className="hidden md:flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/login">Sign Up</Link>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-full flex-1 flex items-center px-4 sm:px-6 lg:px-8">
                         <div className="space-y-6 relative">
                            <div className="relative">
                                <Sparkles className="h-6 w-6 text-purple-400 absolute -top-12 left-1/4" />
                                <Sparkles className="h-4 w-4 text-purple-300 absolute -bottom-12 right-1/4" />
                                <h2 className="text-4xl md:text-6xl font-bold !leading-tight text-foreground text-left">
                                    Snap, Track, <br/> & Thrive
                                </h2>
                            </div>
                            <p className="max-w-md text-lg text-muted-foreground text-left">
                               Your AI-powered nutrition coach. Instantly identify food from a photo, track your macros, and get personalized health advice to reach your goals faster.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start justify-start gap-4 pt-4 text-left">
                                <Button asChild size="lg" className="h-12 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-transform hover:scale-105">
                                    <Link href="/login">Get Started <ChevronRight className="h-5 w-5 ml-1" /></Link>
                                 </Button>
                                <p className="text-sm text-muted-foreground sm:self-center">
                                    Already have an account? <Link href="/login" className="underline hover:text-primary">Log In</Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial Section */}
                    <section className="w-full max-w-2xl mx-auto py-8 text-center">
                        <div className="flex flex-col items-center">
                            <Image 
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
                                alt="Testimonial user" 
                                width={56} 
                                height={56} 
                                className="rounded-full"
                            />
                            <blockquote className="mt-4 text-lg italic text-foreground">
                                &ldquo;NutriSnap has completely changed how I approach my diet. It's so simple to use and the AI is incredibly accurate!&rdquo;
                            </blockquote>
                            <p className="mt-2 font-semibold text-muted-foreground">- Alex Johnson</p>
                        </div>
                    </section>
                </main>

                <footer className="p-4 sm:p-6 text-center text-xs text-muted-foreground">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </footer>
            </div>
        </div>
    )
}
