

export interface Food {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
}

export interface LoggedItem {
  id: string;
  food: Food;
  servings: number;
}

export interface Meal {
  id: string;
  name: string;
  timestamp: number;
  items: LoggedItem[];
  imageUrl?: string;
}

export interface DailySummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  uid?: string;
  displayName: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  weight?: number; // in kg
  height?: number; // in cm
}
