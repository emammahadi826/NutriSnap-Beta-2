
"use client";

import { useAuth } from '@/hooks/use-auth';
import { NutriSnapApp } from '@/components/nutrisnap-app';

export default function Home() {
  const { loading } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-muted-foreground">লোড হচ্ছে...</div>
        </div>
    );
  }

  return (
    <main className="min-h-screen w-full">
      <NutriSnapApp />
    </main>
  );
}
