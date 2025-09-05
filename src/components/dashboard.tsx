
"use client";

import type { Meal, DailySummary, DailySummaryWithDate } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Flame, Wheat, Drumstick, Droplets, Utensils } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ReactNode } from 'react';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';


interface DashboardProps {
  meals: Meal[];
  summary: DailySummary;
}

const processMealDataForChart = (meals: Meal[]): DailySummaryWithDate[] => {
    const endDate = new Date();
    const startDate = subDays(endDate, 29);
    
    const dailyDataMap = new Map<string, DailySummaryWithDate>();

    // Initialize all days in the last 30 days with 0 values
    for (let i = 0; i < 30; i++) {
        const date = subDays(endDate, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        dailyDataMap.set(dateStr, { date: dateStr, calories: 0, protein: 0, carbs: 0, fat: 0 });
    }

    meals.forEach(meal => {
        const mealDate = new Date(meal.timestamp);
        if (isWithinInterval(mealDate, { start: startDate, end: endDate })) {
            const dateStr = format(mealDate, 'yyyy-MM-dd');
            const dayData = dailyDataMap.get(dateStr);
            
            if(dayData) {
                meal.items.forEach(item => {
                    dayData.calories += item.food.calories * item.servings;
                    dayData.protein += item.food.protein * item.servings;
                    dayData.carbs += item.food.carbs * item.servings;
                    dayData.fat += item.food.fat * item.servings;
                });
                dailyDataMap.set(dateStr, dayData);
            }
        }
    });

    return Array.from(dailyDataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-sm">
        <div className="font-bold">{format(parseISO(label), 'MMM d, yyyy')}</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-sm">
            <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: 'hsl(var(--chart-1))'}} />
                Carbs:
            </div>
            <div className="text-right font-mono">{`${Math.round(payload[0].value)}g`}</div>
             <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: 'hsl(var(--chart-2))'}} />
                Protein:
            </div>
            <div className="text-right font-mono">{`${Math.round(payload[1].value)}g`}</div>
             <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: 'hsl(var(--chart-3))'}} />
                Fat:
            </div>
            <div className="text-right font-mono">{`${Math.round(payload[2].value)}g`}</div>
        </div>
      </div>
    );
  }
  return null;
};


export function Dashboard({ meals, summary }: DashboardProps) {
  
  const chartData = processMealDataForChart(meals);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.calories)}</div>
              <p className="text-xs text-muted-foreground">kcal consumed today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carbohydrates</CardTitle>
              <Wheat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.carbs)}g</div>
              <p className="text-xs text-muted-foreground">Goal: ~150g</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Protein</CardTitle>
              <Drumstick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.protein)}g</div>
              <p className="text-xs text-muted-foreground">Goal: ~120g</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fat</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(summary.fat)}g</div>
              <p className="text-xs text-muted-foreground">Goal: ~60g</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-5">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Macro Trends</CardTitle>
            <CardDescription>Your macronutrient intake for the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorCarbs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis 
                        dataKey="date" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(str) => format(parseISO(str), 'd')}
                    />
                    <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}g`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="carbs" name="Carbs" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorCarbs)" />
                    <Area type="monotone" dataKey="protein" name="Protein" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorProtein)" />
                    <Area type="monotone" dataKey="fat" name="Fat" stroke="hsl(var(--chart-3))" fillOpacity={1} fill="url(#colorFat)" />
                </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
            <CardDescription>A log of all your meals from today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {meals.filter(meal => new Date(meal.timestamp).toDateString() === new Date().toDateString()).length > 0 ? (
                <ul className="space-y-4">
                  {meals.filter(meal => new Date(meal.timestamp).toDateString() === new Date().toDateString()).map(meal => (
                    <li key={meal.id} className="flex items-start gap-4">
                      <div className="bg-secondary p-3 rounded-full mt-1">
                         <Utensils className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{meal.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {meal.items.map(item => `${item.servings}x ${item.food.name}`).join(', ')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-[250px]">
                  <p className="text-lg text-muted-foreground">No meals logged yet</p>
                  <p className="text-sm text-muted-foreground">Go to the chat to log a meal!</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
