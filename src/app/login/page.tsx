
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Flame, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
  );

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { logIn, signInWithGoogle, loading, error } = useAuth();
  const { toast } = useToast();
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        toast({ variant: 'destructive', title: 'Sign-up failed', description: "Passwords do not match." });
        return;
      }
      // Redirect to complete profile page with credentials
      const params = new URLSearchParams();
      params.set('email', email);
      params.set('password', password);
      router.push(`/complete-profile?${params.toString()}`);

    } else {
      const success = await logIn(email, password);
      if (!success) {
        toast({ variant: 'destructive', title: 'Login failed', description: error });
      } else {
        router.push('/');
      }
    }
  };
  
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

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
              : 'Log in to access your account'}
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
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background pr-10"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                    <Input 
                        id="confirm-password" 
                        type={showConfirmPassword ? "text" : "password"} 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-background pr-10"
                    />
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                </div>
              </div>
            )}
            <Button type="submit" className="w-full h-10 font-semibold" disabled={loading}>
              {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              type="button" 
              disabled={loading}
              onClick={async () => {
                const success = await signInWithGoogle();
                if (success) {
                  router.push('/');
                } 
              }}
            >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center text-sm">
            <p className="text-muted-foreground">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <Button variant="link" className="p-1" onClick={toggleForm}>
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
