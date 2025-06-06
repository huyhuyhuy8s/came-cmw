
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First check if the email is confirmed
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      // If we can't check the user, we'll try to sign in anyway
      if (!userError && userData?.user?.email === email && !userData?.user?.email_confirmed_at) {
        toast({
          title: "Email not confirmed",
          description: "Please check your email and confirm your account before signing in.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      await login(email, password);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Check if the error is due to unconfirmed email
      if (error.message?.includes('Email not confirmed')) {
        toast({
          title: "Email not confirmed",
          description: "Please check your email and confirm your account before signing in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: error.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleForgotPassword = () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to forgot password page or show a modal
    navigate('/forgot-password', { state: { email } });
  };
  
  return (
    <div className="py-12 came-container">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mono mb-8 text-center">Sign In</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Button 
                type="button" 
                variant="link" 
                className="p-0 h-auto text-sm"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold underline text-black">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
