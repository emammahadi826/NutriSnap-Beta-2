"use client";

import { Button } from "@/components/ui/button";
import { Flame, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
    const backgroundImageUrl = "https://scontent.fjsr13-1.fna.fbcdn.net/v/t39.30808-6/545421705_122180223494341504_3782632148086553738_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFMKdp1v5GfOyQ_-1AFiAihGSl0p9pVq3oZKXSn2lWreoTCmLABOcCHMxPH0m-a9StDHnuFRnkt5dPBV-8uW0pB&_nc_ohc=yZ3Z8WpaRaoQ7kNvwH4Bn9b&_nc_oc=AdkR5tEYjua-jVzDRq2YetzaTUtycKjTB87QVyz_yo28LZ11Xg6oP5sVjfxGWJZ5HIE&_nc_zt=23&_nc_ht=scontent.fjsr13-1.fna&_nc_gid=5_CLsAeej2m-bbA-bt6oDg&oh=00_AfbcIknd_TyqfDTnQ9PuxOyANbJ_r45tEjIZgTKniUW5Cg&oe=68C6F599";

    return (
        <div 
            className="relative flex flex-col min-h-screen text-white bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col flex-1">
                <header className="p-4 sm:p-6">
                    <div className="flex items-center gap-2">
                        <Flame className="w-7 h-7 text-primary" />
                        <h1 className="text-xl font-bold font-headline">NutriSnap</h1>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="container mx-auto grid grid-cols-1 items-center gap-8 text-center">
                        <div className="space-y-6 relative">
                            <Sparkles className="h-6 w-6 text-purple-400 absolute -top-12 left-1/4" />
                            <Sparkles className="h-4 w-4 text-purple-300 absolute -bottom-12 right-1/4" />
                            <h2 className="text-4xl md:text-6xl font-bold !leading-tight text-white">
                                Your Smart <br/> Nutrition Companion
                            </h2>
                            <p className="max-w-md mx-auto text-lg text-gray-200">
                                From quick snacks to full meals, NutriSnap is the only AI-powered assistant that helps you track your diet and achieve your health goals.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button asChild size="lg" className="h-12 px-8 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg transition-transform hover:scale-105">
                                    <Link href="/login">Get Started <ChevronRight className="h-5 w-5 ml-1" /></Link>
                                </Button>
                                <p className="text-sm text-gray-300">
                                    Already have an account? <Link href="/login" className="underline hover:text-primary">Log In</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="p-4 sm:p-6 text-center text-xs text-gray-400">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </footer>
            </div>
        </div>
    )
}