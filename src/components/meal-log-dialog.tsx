
"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Loader2, Plus, Minus, X, Info, Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { identifyFoodFromImage, IdentifyFoodFromImageOutput } from '@/ai/flows/identify-food-from-image';
import { findFood } from '@/lib/nutrition-data';
import type { Meal, LoggedItem } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';

interface MealLogDialogProps {
  onMealLog: (meal: Omit<Meal, 'id' | 'timestamp'>) => void;
  isGuest: boolean;
  guestMealCount: number;
  trigger?: React.ReactNode;
  startWithCamera?: boolean;
}

type FoodResult = LoggedItem & { originalName: string; confidence: number };

export function MealLogDialog({ onMealLog, isGuest, guestMealCount, trigger, startWithCamera = false }: MealLogDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'upload' | 'camera' | 'result' | 'loading' | 'error' | 'limit'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [results, setResults] = useState<FoodResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const GUEST_LIMIT = 3;

  const handleDialogOpen = (open: boolean) => {
    if (open) {
        if (isGuest && guestMealCount >= GUEST_LIMIT) {
            setView('limit');
        } else if(startWithCamera) {
            setView('camera');
        } else {
            setView('upload');
        }
    }
    setIsOpen(open);
  }

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (view !== 'camera' || !isOpen) return;
      try {
        const videoConstraints: MediaStreamConstraints = {
            video: {
                facingMode: { exact: "environment" }
            }
        };
        stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing rear camera, trying any camera:', err);
        try {
            // Fallback to any available camera if the rear one fails
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'ক্যামেরা অ্যাক্সেস अस्वीकार করা হয়েছে',
              description: 'এই অ্যাপটি ব্যবহার করতে দয়া করে আপনার ব্রাউজার সেটিংসে ক্যামেরার অনুমতি সক্ষম করুন।',
            });
        }
      }
    };

    getCameraPermission();

    return () => {
        stream?.getTracks().forEach(track => track.stop());
    }
  }, [view, toast, isOpen]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageData(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetState = () => {
    setView(startWithCamera ? 'camera' : 'upload');
    setImagePreview(null);
    setImageData(null);
    setResults([]);
    setError(null);
    setHasCameraPermission(null);
     if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    handleDialogOpen(open);
    if (!open) {
      setTimeout(resetState, 300);
    }
  }

  const handleAnalyze = async () => {
    if (isGuest && guestMealCount >= GUEST_LIMIT) {
        setView('limit');
        return;
    }
    if (!imageData) {
      toast({
        variant: "destructive",
        title: "কোনো ছবি নির্বাচন করা হয়নি",
        description: "বিশ্লেষণ করার জন্য অনুগ্রহ করে একটি ছবি নির্বাচন করুন।",
      });
      return;
    }
    setView('loading');
    setError(null);
    try {
      const aiResult: IdentifyFoodFromImageOutput = await identifyFoodFromImage({ photoDataUri: imageData });
      
      if (!aiResult.foodItems || aiResult.foodItems.length === 0) {
        setError("আমরা আপনার ছবিতে কোনো খাবার শনাক্ত করতে পারিনি। অনুগ্রহ করে অন্য একটি ছবি চেষ্টা করুন।");
        setView('error');
        return;
      }

      const processedResults: FoodResult[] = aiResult.foodItems
        .map((item, index) => {
          const matchedFood = findFood(item.name);
          if (matchedFood) {
            return {
              id: `${Date.now()}-${index}`,
              food: matchedFood,
              servings: 1,
              originalName: item.name,
              confidence: item.confidence,
            };
          }
          return null;
        })
        .filter((item): item is FoodResult => item !== null);

      if (processedResults.length === 0) {
        setError("আমরা আইটেমগুলি শনাক্ত করেছি, কিন্তু সেগুলি আমাদের পুষ্টি ডাটাবেসে নেই। একটি সহজ খাবার চেষ্টা করুন বা ম্যানুয়ালি আইটেম যোগ করুন (বৈশিষ্ট্য শীঘ্রই আসছে!)");
        setView('error');
        return;
      }

      setResults(processedResults);
      setView('result');

    } catch (e) {
      console.error(e);
      setError("একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। আমাদের AI व्यस्त থাকতে পারে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      setView('error');
    }
  };

  const handleServingChange = (id: string, delta: number) => {
    setResults(currentResults =>
      currentResults.map(r =>
        r.id === id ? { ...r, servings: Math.max(1, r.servings + delta) } : r
      )
    );
  };
  
  const handleRemoveItem = (id: string) => {
    setResults(currentResults => currentResults.filter(r => r.id !== id));
  };
  
  const handleTakePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        const dataUri = canvas.toDataURL('image/jpeg');
        setImagePreview(dataUri);
        setImageData(dataUri);
        setView('upload');
    }
  }


  const handleLogMeal = () => {
    if (results.length === 0) {
        toast({
            variant: "destructive",
            title: "লগ করার জন্য কোনো আইটেম নেই",
            description: "অনুগ্রহ করে একটি ছবি বিশ্লেষণ করুন এবং প্রথমে আইটেমগুলি নিশ্চিত করুন।",
        });
        return;
    }
    
    const meal: Omit<Meal, 'id' | 'timestamp'> = {
      name: results.length > 1 ? `${results[0].food.name} এবং আরও` : results[0].food.name,
      items: results,
      imageUrl: imagePreview ?? undefined,
    };
    onMealLog(meal);
    toast({
      title: "খাবার লগ করা হয়েছে!",
      description: `আপনার খাবারটি আপনার ${isGuest ? 'অতিথি' : 'দৈনিক'} লগে যোগ করা হয়েছে।`,
      className: "bg-primary text-primary-foreground"
    });
    handleOpenChange(false);
  };
  
  const defaultTrigger = (
      <Button size="lg" className="font-bold text-base">
          <Camera className="mr-2 h-5 w-5" /> একটি খাবার লগ করুন
      </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild onClick={() => handleDialogOpen(true)}>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-md bg-card">
        <DialogHeader>
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                 {(view === 'camera' && !startWithCamera) && (
                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setView('upload')}>
                         <ArrowLeft className="h-5 w-5" />
                     </Button>
                 )}
                 <DialogTitle className="font-headline text-2xl">একটি নতুন খাবার লগ করুন</DialogTitle>
              </div>
          </div>
          {view !== 'limit' && <DialogDescription>
            আপনার খাবারের একটি ছবি তুলুন এবং আমাদের AI-কে বাকিটা করতে দিন।
          </DialogDescription>}
        </DialogHeader>

        {view === 'limit' && (
           <div className="flex flex-col items-center justify-center text-center min-h-[20rem] gap-4">
            <Info className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">আপনি আপনার অতিথি সীমা পৌঁছেছেন!</h3>
            <p className="text-muted-foreground">
                আপনি অতিথি হিসাবে {GUEST_LIMIT} টি খাবার লগ করেছেন। আপনার অগ্রগতি সংরক্ষণ করতে এবং সীমাহীন খাবার লগ করতে অনুগ্রহ করে একটি অ্যাকাউন্ট তৈরি করুন।
            </p>
            <div className="flex flex-col gap-2 w-full">
                <Button asChild size="lg"><Link href="/login">লগইন বা সাইন আপ করুন</Link></Button>
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>হয়তো পরে</Button>
            </div>
          </div>
        )}
        
        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-muted-foreground">আপনার খাবার বিশ্লেষণ করা হচ্ছে...</p>
          </div>
        )}

        {view === 'error' && (
           <div className="flex flex-col items-center justify-center min-h-[20rem] gap-4">
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>বিশ্লেষণ ব্যর্থ হয়েছে</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button variant="outline" onClick={resetState}>আবার চেষ্টা করুন</Button>
          </div>
        )}
        
        {view === 'upload' && (
          <div className="space-y-4 py-4">
             <div 
              className="relative w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/80 transition-colors bg-background"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Meal preview" fill className="object-cover rounded-md" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-12 w-12 mb-2" />
                  <p>একটি ছবি আপলোড করতে ক্লিক করুন</p>
                  <p className="text-xs">অথবা টেনে আনুন</p>
                </div>
              )}
            </div>
            <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
             <Button onClick={handleAnalyze} disabled={!imagePreview} className="w-full font-bold text-base py-6">
              খাবার বিশ্লেষণ করুন
            </Button>
          </div>
        )}

        {view === 'camera' && (
            <div className="space-y-4">
                <div className="relative w-full aspect-video bg-background rounded-md overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />
                </div>
                 {hasCameraPermission === false && (
                    <Alert variant="destructive">
                      <AlertTitle>ক্যামেরা অ্যাক্সেস প্রয়োজন</AlertTitle>
                      <AlertDescription>
                        এই বৈশিষ্ট্যটি ব্যবহার করতে দয়া করে ক্যামেরা অ্যাক্সেসের অনুমতি দিন। আপনাকে আপনার ব্রাউজার সেটিংসে অনুমতি পরিবর্তন করতে হতে পারে।
                      </AlertDescription>
                    </Alert>
                )}
                <DialogFooter>
                    <Button onClick={handleTakePhoto} disabled={hasCameraPermission === false} className="w-full">
                        <Camera className="mr-2 h-5 w-5" /> ছবি তুলুন
                    </Button>
                </DialogFooter>
            </div>
        )}
        
        {view === 'result' && (
          <div className="space-y-4">
            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                {results.map(item => (
                    <Card key={item.id} className="flex items-center p-3 gap-3 relative group bg-background">
                       <div className="flex-grow">
                            <p className="font-semibold">{item.food.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {Math.round(item.food.calories)} ক্যালোরি প্রতি {item.food.unit}
                            </p>
                       </div>
                       <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleServingChange(item.id, -1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-bold w-6 text-center">{item.servings}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleServingChange(item.id, 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                       </div>
                    </Card>
                ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetState}>আবার শুরু করুন</Button>
              <Button onClick={handleLogMeal} className="font-bold">খাবার লগ করুন</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
