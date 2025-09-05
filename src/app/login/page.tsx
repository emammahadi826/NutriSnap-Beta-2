
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Flame } from 'lucide-react';
import Link from 'next/link';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.37 1.62-4.24 1.62-3.33 0-6.03-2.7-6.03-6.03s2.7-6.03 6.03-6.03c1.9 0 3.16.77 4.08 1.65l2.66-2.66C18.04 2.62 15.61 1.5 12.48 1.5c-5.48 0-9.94 4.46-9.94 9.94s4.46 9.94 9.94 9.94c5.22 0 9.4-4.34 9.4-9.56 0-.6-.05-1.18-.16-1.74Z"
      />
    </svg>
  );

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { signUp, logIn, loading, error } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    if (isSignUp) {
      success = await signUp(email, password);
      if (success) {
        toast({ title: 'Account created successfully!' });
      } else {
        toast({ variant: 'destructive', title: 'Sign-up Failed', description: error });
      }
    } else {
      success = await logIn(email, password);
      if (success) {
        toast({ title: 'Logged in successfully!' });
      } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: error });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-foreground">
      <div className="flex items-center gap-2 mb-8">
        <Flame className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold font-headline">NutriSnap</h1>
      </div>
      <Card className="w-full max-w-sm border-border/50 bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your details to get started'
              : 'Login to access your account'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {!isSignUp && (
                       <Link href="#" className="text-xs text-primary/80 hover:text-primary hover:underline">
                          Forgot your password?
                      </Link>
                  )}
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
              {loading ? (isSignUp ? 'Creating...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full" type="button" disabled={loading}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center text-sm">
            <p className="text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <Button variant="link" className="p-1" onClick={() => {
                    setIsSignUp(!isSignUp);
                    setEmail('');
                    setPassword('');
                }}>
                    {isSignUp ? 'Login' : 'Sign up'}
                </Button>
            </p>
        </CardFooter>
      </Card>
      <p className="px-8 text-center text-xs text-muted-foreground mt-8 max-w-sm">
        By clicking continue, you agree to our{' '}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
