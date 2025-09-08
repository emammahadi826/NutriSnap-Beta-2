
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, QrCode, Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { Separator } from './ui/separator';

export function ProfilePage() {
    const { user, userProfile, loading: authLoading, updateUserProfile } = useAuth();
    const { toast } = useToast();
  
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined);
    const [age, setAge] = useState<number | string>('');
    const [weight, setWeight] = useState<number | string>('');
    const [height, setHeight] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.displayName || '');
            setGender(userProfile.gender || undefined);
            setAge(userProfile.age || '');
            setWeight(userProfile.weight || '');
            setHeight(userProfile.height ? (userProfile.height / 30.48).toFixed(1) : '');
        }
    }, [userProfile]);

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

        if (ageNum > 150 || ageNum <= 0) {
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

        setIsSubmitting(true);
        
        const profileData: Partial<UserProfile> = {
            displayName: name,
            gender: gender,
            age: ageNum,
            weight: weight ? weightNum : undefined,
            height: height ? Math.round(heightNum * 30.48) : undefined,
        };

        const success = await updateUserProfile(profileData);

        if (success) {
            toast({
                title: 'Profile Updated!',
                description: 'Your changes have been saved successfully.',
                className: 'bg-primary text-primary-foreground'
            });
        } else {
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not update your profile. Please try again.'
            });
        }
        setIsSubmitting(false);
    };

    if (authLoading) {
        return <ProfilePageSkeleton />;
    }

    if (!user) {
        return (
             <div className="flex flex-col items-center justify-center text-center p-8">
                <h2 className="text-xl font-semibold">Please log in</h2>
                <p className="text-muted-foreground mt-2">
                    You need to be logged in to view your profile.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.photoURL ?? undefined} alt={userProfile?.displayName || 'User'} />
                        <AvatarFallback className="text-3xl">
                            {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : <User />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                        <h2 className="text-2xl font-bold">{userProfile?.displayName || 'User'}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <QrCode className="h-8 w-8 text-muted-foreground" />
            </div>

            <Separator />
            
            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label>Gender <span className="text-destructive">*</span></Label>
                        <Select onValueChange={(value) => setGender(value as 'male' | 'female' | 'other')} value={gender}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select..." />
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                </div>
                
                <div className="pt-2">
                    <Button type="submit" className="h-11 font-semibold text-base" disabled={isSubmitting || authLoading}>
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}


function ProfilePageSkeleton() {
    return (
         <div className="space-y-8">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-5 w-56" />
                    </div>
                </div>
                <Skeleton className="h-8 w-8" />
            </div>
            <Separator />
            <div className="space-y-8 max-w-2xl">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <Skeleton className="h-11 w-32" />
            </div>
        </div>
    )
}
