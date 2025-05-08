
// This is a mock service that would be replaced with actual Supabase authentication
export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Simulated storage
let currentUser: User | null = null;

// Check if user is already logged in (from localStorage in a real app)
const checkExistingSession = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const savedUser = localStorage.getItem('came-user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    currentUser = user;
    setTimeout(() => resolve(user), 500);
  });
};

// Register
const register = async (email: string, password: string, username: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would call Supabase auth.signUp
  const newUser: User = {
    id: `user_${Math.floor(Math.random() * 10000)}`,
    email,
    username,
    avatar_url: null,
  };
  
  currentUser = newUser;
  localStorage.setItem('came-user', JSON.stringify(newUser));
  
  return newUser;
};

// Login
const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would call Supabase auth.signInWithPassword
  // For demo, we'll create a mock user
  if (email && password) { // Just check that they're not empty
    const user: User = {
      id: `user_${Math.floor(Math.random() * 10000)}`,
      email,
      username: email.split('@')[0],
      avatar_url: null,
    };
    
    currentUser = user;
    localStorage.setItem('came-user', JSON.stringify(user));
    
    return user;
  }
  
  throw new Error('Invalid login credentials');
};

// Logout
const logout = async (): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would call Supabase auth.signOut
  currentUser = null;
  localStorage.removeItem('came-user');
};

// Reset password
const resetPassword = async (email: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would call Supabase auth.resetPasswordForEmail
  console.log(`Password reset email sent to ${email}`);
};

// Update user profile
const updateProfile = async (data: Partial<User>): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would update the user profile in Supabase
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  const updatedUser = { ...currentUser, ...data };
  currentUser = updatedUser;
  localStorage.setItem('came-user', JSON.stringify(updatedUser));
  
  return updatedUser;
};

const authService = {
  checkExistingSession,
  register,
  login,
  logout,
  resetPassword,
  updateProfile,
};

export default authService;
