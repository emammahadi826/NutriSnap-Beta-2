
"use client";

import { NutritionChart } from './nutrition-chart';
import type { Meal } from '@/lib/types';

interface ReportPageProps {
    meals: Meal[];
}

export function ReportPage({ meals }: ReportPageProps) {
    return (
        <div className="space-y-6">
            <NutritionChart meals={meals} />
        </div>
    );
}
