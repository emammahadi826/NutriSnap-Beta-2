
"use client";

import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="flex items-center gap-2 mb-4">
                <Flame className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline">NutriSnap</h1>
            </div>

            <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mt-4">
                    Snap, Track, & Thrive
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your AI-powered nutrition coach. Instantly identify food from a photo, track your macros, and get personalized health advice to reach your goals faster.
                </p>
            </div>

            <div className="relative w-full max-w-4xl aspect-[16/9] my-8 rounded-lg overflow-hidden shadow-2xl">
                 <Image
                    src="https://picsum.photos/seed/nutrisnap-welcome/1280/720"
                    alt="A healthy and vibrant meal"
                    fill
                    className="object-cover"
                    data-ai-hint="healthy food"
                />
            </div>

            <div className="flex flex-col items-center gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-lg font-bold">
                    <Link href="/login">Get Started</Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="underline hover:text-primary">Log In</Link>
                </p>
            </div>
        </div>
    )
}
