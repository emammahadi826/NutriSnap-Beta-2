
"use client";

import { useAuth } from '@/hooks/use-auth';
import { NutriSnapApp } from '@/components/nutrisnap-app';
import { ClientOnly } from '@/components/client-only';

export default function Home() {
  const { loading } = useAuth();

  // The loading state is now handled inside NutriSnapApp to prevent hydration errors.
  // We will always render the main structure.
  if (loading) {
    return (
      <main className="min-h-screen w-full">
        <ClientOnly>
          <NutriSnapApp />
        </ClientOnly>
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
