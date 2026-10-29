import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile, Language } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithEmail: (email: string, pass: string, lang: Language) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, lang: Language) => Promise<void>;
  resetPassword: (email: string, lang: Language) => Promise<void>;
  logout: () => Promise<void>;
  incrementDesignsCreated: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bootstrapped admin email designated for Daily Earn Pro
const BOOTSTRAP_ADMIN_EMAIL = 'r71468973@gmail.com';

export function getAuthErrorMessage(errorCode: string, lang: Language): string {
  if (lang === 'hi') {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
        return 'गलत पासवर्ड या ईमेल। कृपया दोबारा जांचें।';
      case 'auth/user-not-found':
        return 'इस ईमेल से कोई खाता नहीं मिला। कृपया पहले साइन अप करें।';
      case 'auth/email-already-in-use':
        return 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें या दूसरा ईमेल चुनें।';
      case 'auth/weak-password':
        return 'पासवर्ड कमजोर है। कृपया कम से कम 6 अक्षरों का मजबूत पासवर्ड रखें।';
      case 'auth/invalid-email':
        return 'कृपया मान्य ईमेल पता दर्ज करें (उदा. yourname@gmail.com)।';
      case 'auth/too-many-requests':
        return 'बहुत अधिक असफल प्रयास हुए हैं। कृपया कुछ मिनट बाद दोबारा प्रयास करें।';
      case 'auth/network-request-failed':
        return 'इंटरनेट कनेक्शन उपलब्ध नहीं है। कृपया नेटवर्क चेक करें।';
      case 'auth/operation-not-allowed':
        return 'Firebase Console में Email/Password प्रदाता सक्षम (Enable) नहीं है। कृपया Firebase Console > Authentication > Sign-in method में इसे चालू करें।';
      default:
        return 'प्रमाणीकरण में त्रुटि हुई। कृपया दोबारा प्रयास करें।';
    }
  }

  // English error messages
  switch (errorCode) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please double check and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network connection failure. Please check your internet connection.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is disabled in Firebase Console. Please enable it in Firebase Console > Authentication > Sign-in method.';
    default:
      return 'Authentication failed. Please verify credentials and try again.';
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const clearAuthError = () => setAuthError(null);

  // Sync user profile and admin status from Firestore
  const syncProfile = async (firebaseUser: User) => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userDocRef);
      const isEmailAdmin = firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

      // Check if user exists in /admins collection
      let hasAdminDoc = false;
      try {
        const adminDocRef = doc(db, 'admins', firebaseUser.uid);
        const adminSnap = await getDoc(adminDocRef);
        hasAdminDoc = adminSnap.exists();
      } catch {
        // expected if not admin
      }

      const verifiedAdmin = isEmailAdmin || hasAdminDoc;
      setIsAdmin(verifiedAdmin);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
        // Update last login timestamp
        try {
          await updateDoc(userDocRef, {
            lastLoginAt: new Date().toISOString(),
          });
        } catch {
          // ignore non-critical update failure
        }
      } else {
        // Create initial profile document
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          role: verifiedAdmin ? 'admin' : 'user',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          designsCreatedCount: 0,
        };
        await setDoc(userDocRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Failed to sync profile from Firestore:', err);
      // Fallback local memory profile so user is not blocked
      const fallbackProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        role: firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
      };
      setProfile(fallbackProfile);
      if (firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
        setIsAdmin(true);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncProfile(currentUser);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string, lang: Language) => {
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await syncProfile(res.user);
    } catch (err: any) {
      const msg = getAuthErrorMessage(err?.code || '', lang);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string, lang: Language) => {
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name.trim()) {
        await updateProfile(res.user, { displayName: name.trim() });
      }
      // Write profile to Firestore
      const userDocRef = doc(db, 'users', res.user.uid);
      const isEmailAdmin = res.user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: name.trim(),
        role: isEmailAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        designsCreatedCount: 0,
      };
      try {
        await setDoc(userDocRef, newProfile);
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `users/${res.user.uid}`);
      }
      setProfile(newProfile);
      setIsAdmin(isEmailAdmin);
    } catch (err: any) {
      const msg = getAuthErrorMessage(err?.code || '', lang);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const resetPassword = async (email: string, lang: Language) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      const msg = getAuthErrorMessage(err?.code || '', lang);
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setAuthError(null);
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  const incrementDesignsCreated = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        designsCreatedCount: increment(1),
      });
      // Also update global stats if accessible
      const statsRef = doc(db, 'app_stats', 'global');
      await setDoc(statsRef, {
        totalDesignsCreated: increment(1),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Could not increment design count in Firestore (offline/permission):', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        authError,
        clearAuthError,
        loginWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        incrementDesignsCreated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
