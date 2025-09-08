
"use client";

import { useMemo } from 'react';
import type { Meal } from '@/lib/types';
import { differenceInDays, format, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval, min, max } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from '@/components/chart-wrapper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  const { chartData, summaryData, timeSuffix } = useMemo(() => {
    if (meals.length === 0) {
        return { chartData: [], summaryData: { calories: 0, protein: 0, carbs: 0, fat: 0 }, timeSuffix: 'overall' };
    }
    
    const mealTimestamps = meals.map(m => new Date(m.timestamp));
    const firstDate = startOfDay(min(mealTimestamps));
    const lastDate = endOfDay(max(mealTimestamps));
    
    const daysInRange = differenceInDays(lastDate, firstDate) + 1;
    const interval = { start: firstDate, end: lastDate };
    
    const allDates = eachDayOfInterval(interval);

    const dateMap = new Map<string, ChartDataPoint>();

    // Initialize map with all dates in the range
    allDates.forEach(date => {
        const dateKey = format(date, 'MMM d');
        dateMap.set(dateKey, { date: dateKey, calories: 0, protein: 0, carbs: 0, fat: 0 });
    });

    // Populate with meal data
    meals.forEach(meal => {
      const dateKey = format(new Date(meal.timestamp), 'MMM d');
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
    });

    const finalChartData = Array.from(dateMap.values());
    
    const totalSummary = finalChartData.reduce((acc, day) => {
        acc.calories += day.calories;
        acc.protein += day.protein;
        acc.carbs += day.carbs;
        acc.fat += day.fat;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    return { 
        chartData: finalChartData, 
        summaryData: totalSummary,
        timeSuffix: `in the last ${daysInRange} days`
    };
  }, [meals]);
  
  const hasData = chartData.some(d => d.calories > 0 || d.protein > 0 || d.carbs > 0 || d.fat > 0);
  
  const xAxisFormatter = (tick: string) => {
    if (isMobile) {
        return format(new Date(tick), "d"); // 1, 2, 3
    }
    return tick;
  };

  return (
    <div className="space-y-8">
        <section>
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.calories)}</div>
                        <p className="text-xs text-muted-foreground">{timeSuffix}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Protein</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.protein)}g</div>
                        <p className="text-xs text-muted-foreground">{timeSuffix}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Carbs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.carbs)}g</div>
                        <p className="text-xs text-muted-foreground">{timeSuffix}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Fat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold tracking-tight">{Math.round(summaryData.fat)}g</div>
                        <p className="text-xs text-muted-foreground">{timeSuffix}</p>
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
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="w-full h-[350px]">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5}/>
                            <XAxis 
                                dataKey="date" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8} 
                                tickFormatter={xAxisFormatter}
                                style={{ fontSize: '0.75rem' }} 
                                interval={'preserveStartEnd'}
                            />
                            <YAxis 
                                yAxisId="left" 
                                orientation="left" 
                                stroke="hsl(var(--chart-1))" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8} 
                                unit="kcal"
                                tickCount={isMobile ? 4 : 5}
                                style={{ fontSize: '0.75rem' }} 
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="hsl(var(--chart-2))" 
                                tickLine={false} 
                                axisLine={false} 
                                tickMargin={8} 
                                unit="g"
                                tickCount={isMobile ? 4 : 5}
                                style={{ fontSize: '0.75rem' }} 
                            />
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
