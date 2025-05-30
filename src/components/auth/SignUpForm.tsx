
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PasswordRequirements from './PasswordRequirements';
import { Link } from 'react-router-dom';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter";
    }
    
    if (!hasLowercase) {
      return "Password must contain at least one lowercase letter";
    }
    
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    
    return null;
  };
  
  const checkEmailExists = async (email: string): Promise<boolean> => {
    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase.rpc('check_if_email_exists', { email_to_check: email });
      
      if (error) {
        console.error('Error checking email:', error);
        toast({
          title: "Error",
          description: `Error checking email: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      
      return data || false;
    } catch (error: any) {
      console.error('Exception checking email:', error);
      toast({
        title: "Error",
        description: `Error checking email: ${error.message}`,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Error",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      toast({
        title: "Account already exists",
        description: "An account with this email already exists. Please sign in instead.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(email, password, username);
      
      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account before signing in."
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting || isCheckingEmail}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <PasswordRequirements />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-black hover:bg-gray-800"
        disabled={isSubmitting || isCheckingEmail}
      >
        {isSubmitting ? 'Creating account...' : (isCheckingEmail ? 'Checking email...' : 'Sign Up')}
      </Button>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold underline text-black">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;
