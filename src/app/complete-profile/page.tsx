
"use client";

import { Suspense } from 'react';
import CompleteProfileForm from './complete-profile-form';

export default function CompleteProfilePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        }>
            <CompleteProfileForm />
        </Suspense>
    );
}
