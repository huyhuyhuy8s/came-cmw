import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { User } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { notificationObserverService, ToastObserver, ConsoleObserver } from '@/services/notificationObserverService';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Set up Observer pattern for notifications
  useEffect(() => {
    const toastObserver = new ToastObserver((message) => {
      toast({ title: 'Notification', description: message });
    });
    const consoleObserver = new ConsoleObserver();
    
    notificationObserverService.addObserver(toastObserver);
    notificationObserverService.addObserver(consoleObserver);
    
    return () => {
      notificationObserverService.removeObserver(toastObserver);
      notificationObserverService.removeObserver(consoleObserver);
    };
  }, [toast]);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          if (session.user) {
            setTimeout(async () => {
              try {
                const userProfile = await authService.getCurrentUser();
                setUser(userProfile);
              } catch (error) {
                console.error('Error fetching user profile:', error);
              }
            }, 0);
          }
        } else {
          setUser(null);
        }
      }
    );
    
    const checkAuth = async () => {
      try {
        const userProfile = await authService.getCurrentUser();
        setUser(userProfile);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user?.email_confirmed_at) {
        throw new Error('Email not confirmed. Please check your email inbox and confirm your account before signing in.');
      }

      const user = await authService.signIn(email, password);
      setUser(user);
      
      // Use Observer pattern for notification
      notificationObserverService.notify({
        message: `Welcome back, ${user.name || user.email}!`,
        type: 'success'
      });
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      await authService.signUp(email, password, username);
      
      notificationObserverService.notify({
        message: `Welcome to Came, ${username || email}! Please check your email to confirm your account.`,
        type: 'success'
      });
      
    } catch (error: any) {
      const errorMessage = error.message || 'Could not create account';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
      console.error('Registration error details:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      notificationObserverService.notify({
        message: 'You have been successfully logged out.',
        type: 'info'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not log out properly.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      notificationObserverService.notify({
        message: 'Check your inbox for instructions to reset your password.',
        type: 'info'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not send password reset email.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = await authService.updateUserProfile(user.id, data);
      setUser(updatedUser);
      notificationObserverService.notify({
        message: 'Your profile has been successfully updated.',
        type: 'success'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Could not update your profile.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
