
"use client";

import { useMemo, useState } from 'react';
import type { Meal } from '@/lib/types';
import { subDays, format, isSameDay, startOfDay } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from '@/components/chart-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils } from 'lucide-react';

interface NutritionChartProps {
  meals: Meal[];
}

type ChartDataPoint = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type SummaryData = {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-sm">
        <p className="font-bold">{label}</p>
        {payload.map((pld: any) => (
             <div key={pld.dataKey} className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: pld.fill }} />
                {pld.name}:
                <span className="ml-2 font-mono font-bold">
                    {Math.round(pld.value)} {pld.dataKey === 'calories' ? 'kcal' : 'g'}
                </span>
             </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
        <div className="flex items-center justify-center flex-wrap gap-4 mt-4 text-sm text-foreground">
            {
                payload.map((entry: any, index: number) => {
                    const { color, value } = entry;
                    const name = value.charAt(0).toUpperCase() + value.slice(1);
                    return (
                        <div key={`item-${index}`} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                            <span>{name}</span>
                        </div>
                    )
                })
            }
        </div>
    );
}

export function NutritionChart({ meals }: NutritionChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const { chartData, summaryData } = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);
    
    const dateMap = new Map<string, ChartDataPoint>();

    // Initialize map with all dates in the range
    for (let i = 0; i < days; i++) {
        const date = format(subDays(endDate, i), 'MMM d');
        dateMap.set(date, { date, calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    // Populate with meal data
    meals.forEach(meal => {
      const mealDate = new Date(meal.timestamp);
      if (mealDate >= startOfDay(startDate) && mealDate <= endDate) {
        const dateKey = format(mealDate, 'MMM d');
        
        let dayData = dateMap.get(dateKey);
        if (dayData) {
          meal.items.forEach(item => {
            dayData!.calories += item.food.calories * item.servings;
            dayData!.protein += item.food.protein * item.servings;
            dayData!.carbs += item.food.carbs * item.servings;
            dayData!.fat += item.food.fat * item.servings;
          });
          dateMap.set(dateKey, dayData);
        }
      }
    });

    const finalChartData = Array.from(dateMap.values()).reverse();
    
    const totalSummary = finalChartData.reduce((acc, day) => {
        acc.calories += day.calories;
        acc.protein += day.protein;
        acc.carbs += day.carbs;
        acc.fat += day.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return { chartData: finalChartData, summaryData: totalSummary };
  }, [meals, timeRange]);
  
  const hasData = chartData.some(d => d.calories > 0 || d.protein > 0 || d.carbs > 0 || d.fat > 0);

  return (
    <div className="space-y-8">
        <section>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.calories)}</div>
                        <p className="text-xs text-muted-foreground">in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '3 months'}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Protein</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.protein)}g</div>
                        <p className="text-xs text-muted-foreground">in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '3 months'}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Carbs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.carbs)}g</div>
                        <p className="text-xs text-muted-foreground">in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '3 months'}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Fat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.fat)}g</div>
                        <p className="text-xs text-muted-foreground">in the last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '3 months'}</p>
                    </CardContent>
                </Card>
            </div>
        </section>

        <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <CardTitle>Nutrition Breakdown</CardTitle>
                    <CardDescription>Your daily nutrition summary.</CardDescription>
                </div>
                <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)} className="w-full sm:w-auto">
                    <TabsList>
                        <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
                        <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
                        <TabsTrigger value="90d">Last 3 Months</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="w-full h-[350px]">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5}/>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" tickLine={false} axisLine={false} tickMargin={8} unit="kcal" />
                            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} tickMargin={8} unit="g"/>
                            <Tooltip 
                                cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                                content={<CustomTooltip />}
                            />
                             <Legend content={<CustomLegend />} />
                            <Bar yAxisId="left" dataKey="calories" name="Calories" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="protein" name="Protein" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="carbs" name="Carbs" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="fat" name="Fat" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Utensils className="h-12 w-12 opacity-50" />
                        <p className="mt-4">No data to display for this period.</p>
                        <p className="text-sm">Log meals to see your nutrition report.</p>
                    </div>
                )}
            </div>
        </CardContent>
        </Card>
    </div>
  );
}
