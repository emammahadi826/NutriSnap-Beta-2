
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Circle, Square, Flame } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


export default function CompleteProfileForm() {
  const { signUpAndCreateProfile, loading: authLoading, error: authError, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);
  const [age, setAge] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const passwordParam = searchParams.get('password');
    // Only set credentials if they exist, don't redirect if they don't
    if (emailParam && passwordParam) {
      setEmail(emailParam);
      setPassword(passwordParam);
    } else if (!user) {
        // If there are no params and the user is not logged in, they shouldn't be here.
        // useAuth will handle redirects for logged in users without profiles.
        router.push('/login');
    }
  }, [searchParams, router, user]);
  
    useEffect(() => {
        if (authError && isSubmitting) {
            toast({
                variant: 'destructive',
                title: 'Sign-up Failed',
                description: authError,
            });
        }
    }, [authError, isSubmitting, toast]);


  if (authLoading && !isSubmitting) {
      return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !gender || !age) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please fill out all required fields (Name, Gender, Age).'
        });
        return;
    }
    
    const ageNum = Number(age);
    const weightNum = Number(weight);
    const heightNum = Number(height);

    if (ageNum > 150 || ageNum <=0) {
        toast({ variant: 'destructive', description: "Please enter a valid age." });
        return;
    }
     if (weight && (weightNum > 500 || weightNum <= 0)) {
        toast({ variant: 'destructive', description: "Please enter a valid weight." });
        return;
    }
    if (height && (heightNum > 9 || heightNum < 2)) {
        toast({ variant: 'destructive', description: "Height must be between 2 and 9 feet." });
        return;
    }

    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Sign-up information is missing. Please start over from the sign-up page.',
        });
        router.push('/login');
        return;
    }

    setIsSubmitting(true);
    
    const profileData: UserProfile = {
        displayName: name,
        gender: gender,
        age: ageNum,
        weight: weight ? weightNum : undefined,
        // Convert feet to cm for storage
        height: height ? Math.round(heightNum * 30.48) : undefined,
    };

    const success = await signUpAndCreateProfile(email, password, profileData);

    if (success) {
        toast({
            title: 'Account Created!',
            description: 'Welcome to NutriSnap!',
            className: 'bg-primary text-primary-foreground'
        });
        router.push('/');
    } else {
        // Error handling is now managed by the useEffect hook or redirects in useAuth
        setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100/50 via-white to-blue-100/50 dark:from-gray-900 dark:via-black dark:to-purple-900/50 p-4 sm:p-6 md:p-8 text-foreground overflow-hidden">
       <div className="absolute inset-0 z-0 opacity-50">
            <Sparkles className="h-4 w-4 text-purple-300 absolute top-[10%] left-[5%]" />
            <Sparkles className="h-6 w-6 text-blue-300 absolute top-[20%] right-[10%]" />
            <Sparkles className="h-5 w-5 text-purple-400 absolute bottom-[15%] left-[15%]" />
            <Sparkles className="h-4 w-4 text-blue-200 absolute bottom-[10%] right-[5%]" />
            <Sparkles className="h-8 w-8 text-purple-200 absolute top-[40%] left-[20%]" />
            <Sparkles className="h-5 w-5 text-blue-400 absolute top-[50%] right-[30%]" />
            <Sparkles className="h-6 w-6 text-blue-200 absolute bottom-[25%] right-[20%]" />
            <Circle className="h-6 w-6 text-blue-200 absolute top-[5%] right-[30%]" />
            <Square className="h-4 w-4 text-purple-300 absolute top-[15%] left-[45%]" />
            <Circle className="h-8 w-8 text-purple-400 absolute bottom-[5%] left-[25%]" />
            <Square className="h-5 w-5 text-blue-300 absolute bottom-[40%] right-[15%]" />
        </div>
      <div className="relative z-10 flex flex-col items-center w-full">
         <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Flame className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline">NutriSnap</h1>
        </div>
        <Card className="w-full max-w-md border-border/50 bg-card/80 dark:bg-card/50 backdrop-blur-sm">
            <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Complete Your Profile</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
                Tell us a bit about yourself to personalize your experience.
            </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                    <Input
                    id="name"
                    type="text"
                    placeholder="e.g., John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                     className="bg-background/50 dark:bg-background/30"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Gender <span className="text-destructive">*</span></Label>
                    <Select onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')} value={gender}>
                        <SelectTrigger className="bg-background/50 dark:bg-background/30">
                            <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="age">Age <span className="text-destructive">*</span></Label>
                    <Input
                        id="age"
                        type="number"
                        placeholder="e.g., 25"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        min="1"
                        max="150"
                        className="bg-background/50 dark:bg-background/30"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                        id="weight"
                        type="number"
                        placeholder="e.g., 70"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        inputMode="decimal"
                        min="1"
                        max="500"
                        className="bg-background/50 dark:bg-background/30"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="height">Height (ft)</Label>
                    <Input
                        id="height"
                        type="number"
                        placeholder="e.g., 5.9"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        inputMode="decimal"
                        min="2"
                        max="9"
                        step="0.1"
                        className="bg-background/50 dark:bg-background/30"
                    />
                </div>

                <Button type="submit" className="w-full h-11 font-semibold text-base" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save and Continue'}
                </Button>
                </CardContent>
            </form>
        </Card>
      </div>
    </div>
  );
}
