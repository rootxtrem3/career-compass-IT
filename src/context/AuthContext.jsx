import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { firebaseAuth, hasFirebaseConfig } from '../services/firebaseClient.js';

const AuthContext = createContext(null);

function mapFirebaseUser(user) {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null
  };
}

export function AuthProvider({ children }) {
  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasFirebaseConfig || !firebaseAuth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      const nextToken = await firebaseUser.getIdToken();
      setToken(nextToken);
      setUser(mapFirebaseUser(firebaseUser));
      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isFirebaseEnabled: hasFirebaseConfig,
      isAuthenticated: Boolean(user && token),
      async login({ email, password }) {
        if (!firebaseAuth) {
          throw new Error('Firebase Auth is not configured. Check VITE_FIREBASE_* variables.');
        }

        const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const nextToken = await result.user.getIdToken();
        setToken(nextToken);
        setUser(mapFirebaseUser(result.user));
        return result;
      },
      async register({ fullName, email, password }) {
        if (!firebaseAuth) {
          throw new Error('Firebase Auth is not configured. Check VITE_FIREBASE_* variables.');
        }

        const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);

        if (fullName?.trim()) {
          await updateProfile(result.user, { displayName: fullName.trim() });
        }

        const nextToken = await result.user.getIdToken();
        setToken(nextToken);
        setUser(mapFirebaseUser(result.user));
        return result;
      },
      async loginWithGoogle() {
        if (!firebaseAuth) {
          throw new Error('Firebase Auth is not configured. Check VITE_FIREBASE_* variables.');
        }

        const result = await signInWithPopup(firebaseAuth, googleProvider);
        const nextToken = await result.user.getIdToken();
        setToken(nextToken);
        setUser(mapFirebaseUser(result.user));
        return result;
      },
      async logout() {
        if (!firebaseAuth) {
          setUser(null);
          setToken(null);
          return;
        }

        await signOut(firebaseAuth);
        setUser(null);
        setToken(null);
      }
    }),
    [token, user, loading, googleProvider]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
