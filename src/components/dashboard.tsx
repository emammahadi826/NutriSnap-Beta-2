
"use client";

import type { Meal, DailySummary } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from '@/components/chart-wrapper';
import { Flame, Wheat, Drumstick, Droplets, Utensils } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo } from 'react';


interface DashboardProps {
  meals: Meal[];
  summary: DailySummary;
}

const COLORS = {
    carbs: 'hsl(var(--chart-1))',
    protein: 'hsl(var(--chart-2))',
    fat: 'hsl(var(--chart-3))'
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-sm">
        <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-1.5" style={{backgroundColor: data.payload.fill}} />
            {data.name}:
             <span className="ml-2 font-mono font-bold">{`${Math.round(data.value)}g`}</span>
        </div>
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
                    const { color, value, payload } = entry;
                    return (
                        <div key={`item-${index}`} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                            <span>{value} ({Math.round(payload.value)}g)</span>
                        </div>
                    )
                })
            }
        </div>
    );
};


export function Dashboard({ meals, summary }: DashboardProps) {
  
  const pieChartData = useMemo(() => [
    { name: 'Carbs', value: Math.max(0, summary.carbs), fill: COLORS.carbs },
    { name: 'Protein', value: Math.max(0, summary.protein), fill: COLORS.protein },
    { name: 'Fat', value: Math.max(0, summary.fat), fill: COLORS.fat },
  ], [summary]);
  
  const hasData = pieChartData.some(item => item.value > 0);

  const todaysMeals = useMemo(() => {
    return meals.filter(meal => new Date(meal.timestamp).toDateString() === new Date().toDateString());
  }, [meals]);

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
            <CardTitle>Today's Macro Breakdown</CardTitle>
            <CardDescription>Your macronutrient distribution for today.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {hasData ? (
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
                    ))}
                  </Pie>
                   <Legend content={<CustomLegend />} />
                     <foreignObject width="100%" height="100%">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-foreground">{Math.round(summary.calories)}</p>
                                <p className="text-sm text-muted-foreground">Total Kcal</p>
                            </div>
                        </div>
                    </foreignObject>
                </PieChart>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <Utensils className="h-12 w-12 opacity-50" />
                    <p className="mt-4">No data to display.</p>
                    <p className="text-sm">Log a meal to see your macro breakdown.</p>
                </div>
              )}
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
              {todaysMeals.length > 0 ? (
                <ul className="space-y-4">
                  {todaysMeals.map(meal => (
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
