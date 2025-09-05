
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function CompleteProfile() {
  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);
  const [age, setAge] = useState<number | string>('');
  const [weight, setWeight] = useState<number | string>('');
  const [height, setHeight] = useState<number | string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }

  if (!user) {
    router.push('/login');
    return null;
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

    setIsSubmitting(true);
    const profileData: Partial<UserProfile> = {
        displayName: name,
        gender: gender,
        age: Number(age),
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
    };

    const success = await updateUserProfile(profileData);

    if (success) {
        toast({
            title: 'Profile Updated!',
            description: 'Welcome to NutriSnap!',
            className: 'bg-primary text-primary-foreground'
        });
        router.push('/');
    } else {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not save your profile. Please try again.'
        });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <Card className="w-full max-w-lg">
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
                placeholder="John Doe"
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
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                    id="height"
                    type="number"
                    placeholder="e.g., 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
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
