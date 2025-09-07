
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
  const { signUpAndCreateProfile, loading: authLoading, error: authError } = useAuth();
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
    if (!emailParam || !passwordParam) {
      toast({
        variant: 'destructive',
        title: 'ত্রুটি',
        description: 'সাইন-আপ তথ্য অনুপস্থিত। অনুগ্রহ করে আবার শুরু করুন।',
      });
      router.push('/login');
    } else {
      setEmail(emailParam);
      setPassword(passwordParam);
    }
  }, [searchParams, router, toast]);

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
            title: 'তথ্য অনুপস্থিত',
            description: 'অনুগ্রহ করে সমস্ত প্রয়োজনীয় ক্ষেত্র পূরণ করুন (নাম, লিঙ্গ, বয়স)।'
        });
        return;
    }

    setIsSubmitting(true);
    
    // Convert height from feet to cm if provided
    const heightInCm = height ? Number(height) * 30.48 : undefined;

    const profileData: UserProfile = {
        displayName: name,
        gender: gender,
        age: Number(age),
        weight: weight ? Number(weight) : undefined,
        height: heightInCm,
    };

    const success = await signUpAndCreateProfile(email, password, profileData);

    if (success) {
        toast({
            title: 'অ্যাকাউন্ট তৈরি হয়েছে!',
            description: 'নিউট্রিস্ন্যাপ-এ স্বাগতম!',
            className: 'bg-primary text-primary-foreground'
        });
        router.push('/');
    } else {
        toast({
            variant: 'destructive',
            title: 'সাইন-আপ ব্যর্থ হয়েছে',
            description: authError || 'আপনার অ্যাকাউন্ট তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
        });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">আপনার প্রোফাইল সম্পূর্ণ করুন</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            আপনার অভিজ্ঞতা ব্যক্তিগতকৃত করতে নিজের সম্পর্কে কিছু বলুন।
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">পুরো নাম <span className="text-destructive">*</span></Label>
                <Input
                id="name"
                type="text"
                placeholder="যেমন, জন ডো"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label>লিঙ্গ <span className="text-destructive">*</span></Label>
                <Select onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')} value={gender}>
                    <SelectTrigger>
                        <SelectValue placeholder="আপনার লিঙ্গ নির্বাচন করুন" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="male">পুরুষ</SelectItem>
                        <SelectItem value="female">মহিলা</SelectItem>
                        <SelectItem value="other">অন্যান্য</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="age">বয়স <span className="text-destructive">*</span></Label>
                <Input
                    id="age"
                    type="number"
                    placeholder="যেমন, ২৫"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="weight">ওজন (কেজি)</Label>
                <Input
                    id="weight"
                    type="number"
                    placeholder="যেমন, ৭০"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="height">উচ্চতা (ফুট)</Label>
                <Input
                    id="height"
                    type="number"
                    placeholder="যেমন, ৫.৯"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                />
            </div>

            <Button type="submit" className="w-full h-11 font-semibold text-base" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'সংরক্ষণ করুন এবং চালিয়ে যান'}
            </Button>
            </CardContent>
        </form>
      </Card>
    </div>
  );
}
