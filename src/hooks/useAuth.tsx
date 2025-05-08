
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

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
  
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const user = await authService.checkExistingSession();
        setUser(user);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(email, password);
      setUser(user);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.username || user.email}!`,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials',
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
      const user = await authService.register(email, password, username);
      setUser(user);
      toast({
        title: 'Registration successful',
        description: `Welcome to Came, ${username || email}!`,
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Could not create account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
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
      toast({
        title: 'Password reset email sent',
        description: 'Check your inbox for instructions to reset your password.',
      });
    } catch (error) {
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
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
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
