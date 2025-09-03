"use client";

import { useAuth } from '@/hooks/use-auth';
import { NutriSnapApp } from '@/components/nutrisnap-app';
import Login from '@/app/login/page';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-muted-foreground">Loading...</div>
        </div>
    );
  }

  return (
    <main className="min-h-screen w-full">
      {user ? <NutriSnapApp /> : <Login />}
    </main>
  );
}
