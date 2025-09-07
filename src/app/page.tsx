
"use client";

import { useAuth } from '@/hooks/use-auth';
import { NutriSnapApp } from '@/components/nutrisnap-app';
import { ClientOnly } from '@/components/client-only';

export default function Home() {
  const { loading, user } = useAuth();
  
  if (loading) {
    return (
        <main className="flex items-center justify-center min-h-screen">
          Loading...
        </main>
    );
  }

  return (
    <main className="min-h-screen w-full">
      <ClientOnly>
        <NutriSnapApp />
      </ClientOnly>
    </main>
  );
}
