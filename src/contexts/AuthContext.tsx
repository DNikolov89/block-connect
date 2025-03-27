
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Define user roles
export type UserRole = 'admin' | 'owner' | 'tenant';

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  blockId: string;
  avatar?: string;
}

// Mock data for current demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@blockconnect.com',
    phone: '+1234567890',
    role: 'admin',
    blockId: 'block123',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Owner User',
    email: 'owner@blockconnect.com',
    phone: '+1234567891',
    role: 'owner',
    blockId: 'block123',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Tenant User',
    email: 'tenant@blockconnect.com',
    phone: '+1234567892',
    role: 'tenant',
    blockId: 'block123',
    avatar: 'https://i.pravatar.cc/150?img=3'
  }
];

// Interface for the auth context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'>, password: string, blockCode: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the auth provider
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('blockconnect_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function (would connect to backend in production)
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = MOCK_USERS.find(u => u.email === email);
      
      if (!mockUser) {
        throw new Error('Invalid credentials');
      }
      
      // Here we would validate password in a real app
      if (password !== 'password') {
        throw new Error('Invalid credentials');
      }
      
      setUser(mockUser);
      localStorage.setItem('blockconnect_user', JSON.stringify(mockUser));
      toast.success(`Welcome back, ${mockUser.name}!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (userData: Omit<User, 'id'>, password: string, blockCode: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate block code
      if (blockCode !== 'block123') {
        throw new Error('Invalid block code');
      }
      
      // Create new user with generated ID
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substring(2, 9),
      };
      
      setUser(newUser);
      localStorage.setItem('blockconnect_user', JSON.stringify(newUser));
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('blockconnect_user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
