
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { NutritionChart } from './nutrition-chart';

export function ReportPage() {
    const { meals, isLoaded } = useMealLogger();

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Reports</h1>
                <p className="text-muted-foreground">View your nutrition reports.</p>
            </header>
            
            {isLoaded ? (
                <NutritionChart meals={meals} />
            ) : (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-16">
                    <p className="text-lg">Loading report data...</p>
                </div>
            )}
        </div>
    );
}
