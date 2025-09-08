
"use client";

import { NutritionChart } from './nutrition-chart';
import type { Meal } from '@/lib/types';
import { MealHistoryTable } from './meal-history-table';

interface ReportPageProps {
    meals: Meal[];
}

export function ReportPage({ meals }: ReportPageProps) {
    return (
        <div className="space-y-8">
            <NutritionChart meals={meals} />
            <MealHistoryTable meals={meals} />
        </div>
    );
}
