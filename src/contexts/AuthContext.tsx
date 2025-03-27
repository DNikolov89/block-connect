import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { useQuery, useMutation } from '@tanstack/react-query';
import { authApi } from '@/api';
import type { User, UserRole } from '@/types';

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
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('blockconnect_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      // Add a small delay to prevent flashing
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await authApi.login(email, password);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data);
      localStorage.setItem('blockconnect_user', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
      throw error;
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async ({ userData, password, blockCode }: { 
      userData: Omit<User, 'id'>; 
      password: string; 
      blockCode: string;
    }) => {
      // Validate block code first
      if (blockCode !== 'block123') {
        throw new Error('Invalid block code');
      }

      const response = await authApi.register(userData, password);
      if (response.error) throw new Error(response.error);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data);
      localStorage.setItem('blockconnect_user', JSON.stringify(data));
      toast.success('Registration successful!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
      throw error;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await authApi.logout();
      if (response.error) throw new Error(response.error);
    },
    onSuccess: () => {
      setUser(null);
      localStorage.removeItem('blockconnect_user');
      toast.info('You have been logged out');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Logout failed');
      throw error;
    },
  });

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await loginMutation.mutateAsync({ email, password });
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: Omit<User, 'id'>, password: string, blockCode: string) => {
    try {
      setLoading(true);
      await registerMutation.mutateAsync({ userData, password, blockCode });
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logoutMutation.mutate();
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
