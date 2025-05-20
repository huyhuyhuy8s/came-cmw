
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least 1 uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least 1 lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least 1 number");
    }
    
    return errors;
  };
  
  const checkEmailExists = async (email: string) => {
    const { data, error } = await supabase.rpc('check_email_exists', { email_input: email });
    
    if (error) {
      console.error('Error checking email:', error);
      return false;
    }
    
    return data;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check password strength
    const errors = validatePassword(password);
    setPasswordErrors(errors);
    
    if (errors.length > 0) {
      return;
    }
    
    if (password !== confirmPassword) {
      setPasswordErrors(["Passwords do not match"]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      
      if (emailExists) {
        toast({
          title: "Email already in use",
          description: "This email address is already registered.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Register user
      await register(email, password, username);
      
      // Show success message
      toast({
        title: "Registration successful!",
        description: "Please check your email to confirm your account before signing in.",
      });
      
      // Navigate to home instead of automatically signing in
      navigate('/');
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Only show errors after user has typed something
    if (newPassword) {
      setPasswordErrors(validatePassword(newPassword));
    } else {
      setPasswordErrors([]);
    }
  };
  
  return (
    <div className="py-12">
      <div className="came-container max-w-md mx-auto">
        <h1 className="text-3xl font-bold mono mb-8 text-center">Create an Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Name</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
            />
            
            {/* Password requirements */}
            <div className="text-xs text-gray-500 space-y-1 mt-2">
              <p>Password requirements:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li className={password.length >= 8 ? "text-green-600" : ""}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                  At least 1 uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>
                  At least 1 lowercase letter
                </li>
                <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                  At least 1 number
                </li>
              </ul>
            </div>
            
            {/* Password errors */}
            {passwordErrors.length > 0 && (
              <div className="text-red-500 text-sm mt-2">
                {passwordErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
            )}
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-black hover:bg-gray-800"
            disabled={isLoading || passwordErrors.length > 0 || password !== confirmPassword}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Creating account...</span>
              </div>
            ) : 'Sign Up'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-black hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
