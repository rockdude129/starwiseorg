import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuthStatus: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  sendPhoneOTP: (phone: string) => Promise<{ userId: string }>;
  verifyPhoneOTP: (userId: string, secret: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  signInWithOAuth: (provider: 'google' | 'github' | 'discord') => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = await AuthService.signIn(email, password);
      setUser(user);
    } catch (error: any) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const user = await AuthService.signUp(email, password, name, phone);
      setUser(user);
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error: any) {
      throw error;
    }
  };

  // Phone/OTP
  const sendPhoneOTP = async (phone: string) => {
    return await AuthService.sendPhoneOTP(phone);
  };
  const verifyPhoneOTP = async (userId: string, secret: string) => {
    await AuthService.verifyPhoneOTP(userId, secret);
    await checkAuthStatus();
  };

  // Magic Link
  const sendMagicLink = async (email: string) => {
    await AuthService.sendMagicLink(email);
  };

  // OAuth 2.0
  const signInWithOAuth = async (provider: 'google' | 'github' | 'discord') => {
    await AuthService.createOAuth2Session(provider);
  };

  const value: AuthContextType = {
    user,
    loading,
    checkAuthStatus,
    signIn,
    signUp,
    signOut,
    sendPhoneOTP,
    verifyPhoneOTP,
    sendMagicLink,
    signInWithOAuth,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 