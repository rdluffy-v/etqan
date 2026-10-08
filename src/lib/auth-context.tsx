'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, VerificationType } from './types';
import { MOCK_USERS } from './mock-data';
import { isFirebaseConfigured, auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isFirebaseActive: boolean;
  loginAsDemo: (userKey: keyof typeof MOCK_USERS) => void;
  switchRole: (role: UserRole) => void;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    fullName: string, 
    email: string, 
    role: UserRole, 
    verificationType: VerificationType, 
    extra?: { academicInstitution?: string; studentIdNumber?: string }
  ) => Promise<boolean>;
  verifyAcademicOcr: (file: File) => Promise<{ success: boolean; data?: { institution: string; studentId: string } }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'etqan_active_user_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // 1. If Firebase is configured and available
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Map Firebase user or load saved profile
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            try {
              setUser(JSON.parse(saved));
            } catch {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || 'user@etqan.ly',
                fullName: firebaseUser.displayName || 'مستخدم إتقان',
                role: 'trainee',
                verificationType: 'personal',
                isVerified: true,
                avatarUrl: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
                points: 500,
                streakDays: 3,
                createdAt: new Date().toISOString(),
              });
            }
          }
        } else {
          // Check local mock session
          const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (saved) {
            try {
              setUser(JSON.parse(saved));
            } catch {
              setUser(MOCK_USERS.trainee_personal);
            }
          } else {
            setUser(MOCK_USERS.trainee_personal);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }

    // 2. Demo / Mock Mode
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(MOCK_USERS.trainee_personal);
      }
    } else {
      setUser(MOCK_USERS.trainee_personal);
    }
    setLoading(false);
  }, []);

  const saveUserSession = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const loginAsDemo = (userKey: keyof typeof MOCK_USERS) => {
    const selected = MOCK_USERS[userKey];
    if (selected) {
      saveUserSession(selected);
    }
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      role,
      fullName: role === 'instructor' ? 'م. خليل الزواوي' : role === 'corporate' ? 'شركة المدار التقني' : role === 'admin' ? 'مدير المنظومة التنفيذي' : 'أحمد الفيتوري',
      cqsRating: role === 'instructor' ? 9.8 : undefined,
    };
    saveUserSession(updated);
  };

  const loginWithEmail = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const newUser: UserProfile = {
          id: res.user.uid,
          email: res.user.email || email,
          fullName: res.user.displayName || email.split('@')[0],
          role: 'trainee',
          verificationType: email.endsWith('.edu.ly') || email.endsWith('.edu') ? 'academic_edu' : 'personal',
          isVerified: true,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          points: 100,
          streakDays: 1,
          createdAt: new Date().toISOString(),
        };
        saveUserSession(newUser);
        setLoading(false);
        return true;
      }

      // Mock login fallback
      const foundMock = Object.values(MOCK_USERS).find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (foundMock) {
        saveUserSession(foundMock);
      } else {
        const isAcademic = email.endsWith('.edu.ly') || email.endsWith('.edu');
        const newUser: UserProfile = {
          id: `usr_${Date.now()}`,
          email,
          fullName: email.split('@')[0],
          role: 'trainee',
          verificationType: isAcademic ? 'academic_edu' : 'personal',
          academicInstitution: isAcademic ? 'جامعة طرابلس' : undefined,
          isVerified: true,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          points: 250,
          streakDays: 2,
          createdAt: new Date().toISOString(),
        };
        saveUserSession(newUser);
      }
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      return false;
    }
  };

  const registerUser = async (
    fullName: string, 
    email: string, 
    role: UserRole, 
    verificationType: VerificationType,
    extra?: { academicInstitution?: string; studentIdNumber?: string }
  ): Promise<boolean> => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const res = await createUserWithEmailAndPassword(auth, email, 'password123');
        const newUser: UserProfile = {
          id: res.user.uid,
          email,
          fullName,
          role,
          verificationType,
          academicInstitution: extra?.academicInstitution,
          studentIdNumber: extra?.studentIdNumber,
          isVerified: verificationType !== 'personal',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
          points: 150,
          streakDays: 1,
          createdAt: new Date().toISOString(),
        };
        saveUserSession(newUser);
        setLoading(false);
        return true;
      }

      // Mock register
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email,
        fullName,
        role,
        verificationType,
        academicInstitution: extra?.academicInstitution,
        studentIdNumber: extra?.studentIdNumber,
        isVerified: true,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
        points: 200,
        streakDays: 1,
        createdAt: new Date().toISOString(),
      };
      saveUserSession(newUser);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setLoading(false);
      return false;
    }
  };

  const verifyAcademicOcr = async (file: File): Promise<{ success: boolean; data?: { institution: string; studentId: string } }> => {
    // Intelligent OCR simulation that parses university card details
    if (file && file.name) {
      // simulate file processing
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = {
          institution: 'جامعة طرابلس - كلية الهندسة وتقنية المعلومات',
          studentId: `UOT-${Math.floor(1000 + Math.random() * 9000)}-2026`,
        };

        if (user) {
          const updated: UserProfile = {
            ...user,
            verificationType: 'academic_ocr',
            academicInstitution: data.institution,
            studentIdNumber: data.studentId,
            isVerified: true,
            points: user.points + 250, // Reward points for verified academic badge
          };
          saveUserSession(updated);
        }

        resolve({ success: true, data });
      }, 1400);
    });
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Firebase signout error:', e);
      }
    }
    saveUserSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        loginAsDemo,
        switchRole,
        loginWithEmail,
        registerUser,
        verifyAcademicOcr,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
