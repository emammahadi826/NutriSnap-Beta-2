
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


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
    }
    // Error handling is now managed by the useEffect hook or redirects in useAuth
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <Card className="w-full max-w-md">
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
                />
            </div>

            <div className="space-y-2">
                <Label>Gender <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')} value={gender}>
                    <SelectTrigger>
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
                />
            </div>

            <Button type="submit" className="w-full h-11 font-semibold text-base" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save and Continue'}
            </Button>
            </CardContent>
        </form>
      </Card>
    </div>
  );
}
