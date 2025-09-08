
"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
  User,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "./use-toast";


interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUpAndCreateProfile: (email: string, pass: string, profileData: UserProfile) => Promise<boolean>;
  logIn: (email: string, pass: string) => Promise<boolean>;
  logOut: () => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  signUpAndCreateProfile: async () => false,
  logIn: async () => false,
  logOut: () => {},
  updateUserProfile: async () => false,
  signInWithGoogle: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const fetchUserProfile = useCallback(async (user: User) => {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const profile = await fetchUserProfile(user);
        setUserProfile(profile);
         const isProfileIncomplete = !profile?.displayName || !profile.age || !profile.gender;
         const isAuthPage = pathname === '/login' || pathname === '/complete-profile';

         if (isProfileIncomplete && !isAuthPage) {
           router.push('/complete-profile');
         }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    
    // Handle redirect result
    const handleRedirect = async () => {
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                const user = result.user;
                const userDocRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(userDocRef);

                if (!docSnap.exists()) {
                    const newUserProfile: UserProfile = {
                      displayName: user.displayName || '',
                      age: null,
                      gender: null,
                    };
                    await setDoc(userDocRef, newUserProfile, { merge: true });
                }
                router.push('/');
            }
        } catch (error: any) {
            console.error("Google sign-in redirect error:", error);
            setError(error.message);
            toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
        }
    }
    handleRedirect();

    return () => unsubscribe();
  }, [fetchUserProfile, router, toast, pathname]);

  const signUpAndCreateProfile = async (email: string, pass: string, profileData: UserProfile) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const newUser = userCredential.user;
      
      // Update Firebase Auth profile displayName
      await updateFirebaseProfile(newUser, { displayName: profileData.displayName });

      // Create user profile document in Firestore
      const userDocRef = doc(db, "users", newUser.uid);
      await setDoc(userDocRef, profileData);

      // Manually update local state as onAuthStateChanged might be slow
      setUser(newUser);
      setUserProfile(profileData);
      
      return true;
    } catch (e: any) {
       if (e.code === 'auth/email-already-in-use') {
            setError('This email is already registered. Please log in.');
             toast({
                variant: 'destructive',
                title: 'Email Already Registered',
                description: 'This email address is already in use. Please log in instead.',
            });
            router.push('/login');
            return false;
        }
      setError(e.message);
      console.error("Sign up failed:", e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const logIn = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (e: any) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logOut = () => {
    signOut(auth);
    router.push('/login');
  };
  
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return false;
    setLoading(true);
    try {
        // Update Firebase Auth profile
        if (profileData.displayName) {
            await updateFirebaseProfile(user, { displayName: profileData.displayName });
        }
        
        // Update/create Firestore document
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, profileData, { merge: true });
        
        // Update local state
        setUserProfile(prev => ({ ...(prev || {}), ...profileData } as UserProfile));
        
        return true;
    } catch (error: any) {
        console.error("Error updating profile:", error);
        setError(error.message);
        return false;
    } finally {
        setLoading(false);
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
      // The redirect will be handled by the useEffect hook
      return true;
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      setError(error.message);
      toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: error.message });
      setLoading(false);
      return false;
    }
  };


  const value = {
    user,
    userProfile,
    loading,
    error,
    signUpAndCreateProfile,
    logIn,
    logOut,
    updateUserProfile,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
