
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
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import { useRouter } from 'next/navigation';


interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, pass: string) => Promise<boolean>;
  logIn: (email: string, pass: string) => Promise<boolean>;
  logOut: () => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  signUp: async () => false,
  logIn: async () => false,
  logOut: () => {},
  updateUserProfile: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
         if (!profile?.displayName) {
          // If profile is incomplete, redirect to complete-profile
          if (window.location.pathname !== '/complete-profile') {
            router.push('/complete-profile');
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile, router]);

  const signUp = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (e: any) {
      setError(e.message);
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


  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    logIn,
    logOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
