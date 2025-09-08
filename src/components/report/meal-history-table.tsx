
"use client";

import type { Meal } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Utensils } from 'lucide-react';

interface MealHistoryTableProps {
  meals: Meal[];
}

export function MealHistoryTable({ meals }: MealHistoryTableProps) {
  
  const calculateMealMacros = (meal: Meal) => {
    return meal.items.reduce((acc, item) => {
        acc.calories += item.food.calories * item.servings;
        acc.protein += item.food.protein * item.servings;
        acc.carbs += item.food.carbs * item.servings;
        acc.fat += item.food.fat * item.servings;
        return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
    
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meal Log History</CardTitle>
        <CardDescription>A complete log of all your recorded meals.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Meal Details</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Protein</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Carbs</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Fat</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {meals.length > 0 ? (
                    meals.map((meal) => {
                        const macros = calculateMealMacros(meal);
                        return (
                            <TableRow key={meal.id}>
                                <TableCell>
                                    {meal.imageUrl ? (
                                        <Image
                                            src={meal.imageUrl}
                                            alt={meal.name}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover aspect-square"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                                            <Utensils className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{meal.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {format(new Date(meal.timestamp), "MMM d, yyyy 'at' h:mm a")}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {meal.items.map(item => (
                                            <Badge key={item.id} variant="secondary">{item.servings}x {item.food.name}</Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">{Math.round(macros.calories)}</TableCell>
                                <TableCell className="text-right font-mono hidden sm:table-cell">{Math.round(macros.protein)}g</TableCell>
                                <TableCell className="text-right font-mono hidden sm:table-cell">{Math.round(macros.carbs)}g</TableCell>
                                <TableCell className="text-right font-mono hidden sm:table-cell">{Math.round(macros.fat)}g</TableCell>
                            </TableRow>
                        )
                    })
                ) : (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No meals logged yet.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
         </div>
      </CardContent>
    </Card>
  );
}
