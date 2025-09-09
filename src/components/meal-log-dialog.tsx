
"use client";

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Camera, Loader2, Plus, Minus, X, Info, Upload, ArrowLeft, User, Coins } from 'lucide-react';
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
import { useAuth } from '@/hooks/use-auth';

interface MealLogDialogProps {
  onMealLog: (meal: Omit<Meal, 'id' | 'timestamp'>) => void;
  trigger?: React.ReactNode;
  startWithCamera?: boolean;
}

type FoodResult = LoggedItem & { originalName: string; confidence: number };

export function MealLogDialog({ onMealLog, trigger, startWithCamera = false }: MealLogDialogProps) {
  const { user, guestCredits, useGuestCredit } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'upload' | 'camera' | 'result' | 'loading' | 'error' | 'auth_required' | 'no_credits'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [results, setResults] = useState<FoodResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const handleDialogOpen = (open: boolean) => {
    if (open) {
        if (!user && guestCredits <= 0) {
            setView('no_credits');
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
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this app.',
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
    if (!user && guestCredits <= 0) {
        setView('no_credits');
        return;
    }
    if (!imageData) {
      toast({
        variant: "destructive",
        title: "No image selected",
        description: "Please select an image to analyze.",
      });
      return;
    }
    setView('loading');
    setError(null);

    if (!user) {
        useGuestCredit();
    }

    try {
      const aiResult: IdentifyFoodFromImageOutput = await identifyFoodFromImage({ photoDataUri: imageData });
      
      if (!aiResult.foodItems || aiResult.foodItems.length === 0) {
        setError("We couldn't identify any food in your image. Please try another one.");
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
        setError("We identified items, but they're not in our nutrition database. Try a simpler meal or add items manually (feature coming soon!)");
        setView('error');
        return;
      }

      setResults(processedResults);
      setView('result');

    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred. Our AI might be busy. Please try again.");
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
    if (!user) {
        setView('auth_required');
        return;
    }
    if (results.length === 0) {
        toast({
            variant: "destructive",
            title: "No items to log",
            description: "Please analyze an image and confirm items first.",
        });
        return;
    }
    
    const meal: Omit<Meal, 'id' | 'timestamp'> = {
      name: results.length > 1 ? `${results[0].food.name} and more` : results[0].food.name,
      items: results,
      imageUrl: imagePreview ?? undefined,
    };
    onMealLog(meal);
    toast({
      title: "Meal Logged!",
      description: `Your meal has been added to your daily log.`,
      className: "bg-primary text-primary-foreground"
    });
    handleOpenChange(false);
  };
  
  const defaultTrigger = (
      <Button size="lg" className="font-bold text-base">
          <Camera className="mr-2 h-5 w-5" /> Log a Meal
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
                 <DialogTitle className="font-headline text-2xl">Log a New Meal</DialogTitle>
              </div>
              {!user && (
                <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    <Coins className="h-4 w-4" />
                    <span>{guestCredits} Credits Left</span>
                </div>
              )}
          </div>
          {view !== 'auth_required' && view !== 'no_credits' && <DialogDescription>
            Snap a picture of your meal and let our AI do the rest.
          </DialogDescription>}
        </DialogHeader>

        {view === 'no_credits' && (
           <div className="flex flex-col items-center justify-center text-center min-h-[20rem] gap-4">
            <Coins className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Out of Credits</h3>
            <p className="text-muted-foreground">
                You've used all your free meal scans. Please sign up to continue logging meals and get unlimited access.
            </p>
            <div className="flex flex-col gap-2 w-full">
                <Button asChild size="lg"><Link href="/login">Login or Sign Up</Link></Button>
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>Maybe Later</Button>
            </div>
          </div>
        )}

        {view === 'auth_required' && (
           <div className="flex flex-col items-center justify-center text-center min-h-[20rem] gap-4">
            <User className="h-12 w-12 text-primary" />
            <h3 className="text-xl font-bold">Authentication Required</h3>
            <p className="text-muted-foreground">
                Please log in or create an account to save your meal data securely.
            </p>
            <div className="flex flex-col gap-2 w-full">
                <Button asChild size="lg"><Link href="/login">Login or Sign Up</Link></Button>
                <Button variant="ghost" onClick={() => handleOpenChange(false)}>Maybe Later</Button>
            </div>
          </div>
        )}
        
        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-muted-foreground">Analyzing your meal...</p>
          </div>
        )}

        {view === 'error' && (
           <div className="flex flex-col items-center justify-center min-h-[20rem] gap-4">
            <Alert variant="destructive">
              <Info className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button variant="outline" onClick={resetState}>Try Again</Button>
          </div>
        )}
        
        {view === 'upload' && (
          <div className="space-y-4 py-4">
             <div 
              className="relative w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/80 transition-colors bg-background"
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <Image src={imagePreview} alt="Meal preview" layout="fill" className="object-cover rounded-md" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-12 w-12 mb-2" />
                  <p>Click to upload an image</p>
                  <p className="text-xs">or drag and drop</p>
                </div>
              )}
            </div>
            <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
             <Button onClick={handleAnalyze} disabled={!imagePreview} className="w-full font-bold text-base py-6">
              Analyze Image
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
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access to use this feature. You may need to change permissions in your browser settings.
                      </AlertDescription>
                    </Alert>
                )}
                <DialogFooter>
                    <Button onClick={handleTakePhoto} disabled={hasCameraPermission === false} className="w-full">
                        <Camera className="mr-2 h-5 w-5" /> Take Photo
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
                                {Math.round(item.food.calories)} calories per {item.food.unit}
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
              <Button variant="outline" onClick={resetState}>Start Over</Button>
              <Button onClick={handleLogMeal} className="font-bold">Log Meal</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

    