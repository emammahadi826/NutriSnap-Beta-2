
"use client";

import { useMealLogger } from '@/hooks/use-meal-logger';
import { NutritionChart } from './nutrition-chart';

export function ReportPage() {
    const { meals, isLoaded } = useMealLogger();

    return (
        <div>
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
