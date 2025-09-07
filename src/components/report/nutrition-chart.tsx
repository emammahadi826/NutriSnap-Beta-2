
"use client";

import { useMemo, useState } from 'react';
import type { Meal } from '@/lib/types';
import { subDays, format, isSameDay, startOfDay } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from '@/components/chart-wrapper';
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

type DataType = 'calories' | 'protein' | 'carbs' | 'fat';

const COLORS: Record<DataType, string> = {
  calories: 'hsl(var(--chart-1))',
  protein: 'hsl(var(--chart-2))',
  carbs: 'hsl(var(--chart-3))',
  fat: 'hsl(var(--chart-4))',
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-sm">
        <p className="font-bold">{label}</p>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: data.fill }} />
          {data.name}:
          <span className="ml-2 font-mono font-bold">
            {Math.round(data.value)} {unit}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function NutritionChart({ meals }: NutritionChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [dataType, setDataType] = useState<DataType>('calories');

  const processedData = useMemo(() => {
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
        if (!dayData) { // Should not happen with pre-initialization, but as a fallback
            dayData = { date: dateKey, calories: 0, protein: 0, carbs: 0, fat: 0 };
        }

        meal.items.forEach(item => {
          dayData!.calories += item.food.calories * item.servings;
          dayData!.protein += item.food.protein * item.servings;
          dayData!.carbs += item.food.carbs * item.servings;
          dayData!.fat += item.food.fat * item.servings;
        });

        dateMap.set(dateKey, dayData);
      }
    });

    return Array.from(dateMap.values()).reverse();
  }, [meals, timeRange]);

  const chartData = useMemo(() => {
    return processedData.map(d => ({
        ...d,
        value: d[dataType],
        fill: COLORS[dataType]
    }));
  }, [processedData, dataType]);
  
  const hasData = chartData.some(d => d.value > 0);
  const dataUnit = dataType === 'calories' ? 'kcal' : 'g';

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                 <CardTitle>Nutrition Report</CardTitle>
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
         <Tabs value={dataType} onValueChange={(value) => setDataType(value as any)}>
            <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="calories">Calories</TabsTrigger>
                <TabsTrigger value="protein">Protein</TabsTrigger>
                <TabsTrigger value="carbs">Carbs</TabsTrigger>
                <TabsTrigger value="fat">Fat</TabsTrigger>
            </TabsList>
        </Tabs>
        
        <div className="w-full h-[350px]">
            {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS[dataType]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={COLORS[dataType]} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.5}/>
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} unit={dataUnit} />
                    <Tooltip 
                        cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
                        content={<CustomTooltip unit={dataUnit}/>}
                    />
                    <Area type="monotone" dataKey="value" name={dataType.charAt(0).toUpperCase() + dataType.slice(1)} stroke={COLORS[dataType]} fillOpacity={1} fill="url(#chartGradient)" strokeWidth={2} />
                    </AreaChart>
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
  );
}
