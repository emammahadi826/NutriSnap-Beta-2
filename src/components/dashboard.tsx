"use client";

import type { Meal, DailySummary } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Flame, Wheat, Drumstick, Droplets, Utensils } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardProps {
  meals: Meal[];
  summary: DailySummary;
}

export function Dashboard({ meals, summary }: DashboardProps) {
  const macroData = [
    { name: 'Macros', carbs: Math.round(summary.carbs), protein: Math.round(summary.protein), fat: Math.round(summary.fat) },
  ];

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
            <CardTitle>Macro Breakdown</CardTitle>
            <CardDescription>Your macronutrient distribution for today (in grams).</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={macroData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} tickMargin={5} />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip
                  cursor={{ fill: 'hsla(var(--muted), 0.5)' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                  }}
                />
                <Legend />
                <Bar dataKey="carbs" name="Carbs" stackId="a" fill="hsl(var(--chart-1))" radius={[4, 0, 0, 4]} />
                <Bar dataKey="protein" name="Protein" stackId="a" fill="hsl(var(--chart-2))" />
                <Bar dataKey="fat" name="Fat" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
              </BarChart>
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
              {meals.length > 0 ? (
                <ul className="space-y-4">
                  {meals.map(meal => (
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
                  <p className="text-sm text-muted-foreground">Click "Log a Meal" to get started!</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
