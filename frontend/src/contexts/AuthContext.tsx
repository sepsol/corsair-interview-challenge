"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@task-manager/shared';
import api from '@/services/api';
import { AuthFormData } from '@/components/AuthForm';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: AuthFormData) => Promise<void>;
  register: (data: AuthFormData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      let userData: User;
      try {
        userData = JSON.parse(storedUser);
      } catch (parseError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Invalid stored user data:', parseError);
        }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      setIsAuthenticated(true);
      setUser(userData);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Authentication verified for user:', userData.username);
      }
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Authentication check failed:', error);
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
    setIsLoading(false);
  }, []);

  const login = async (data: AuthFormData) => {
    const loginData: LoginRequest = {
      username: data.username,
      password: data.password,
    };

    const response = await api.post<AuthResponse>('/auth/login', loginData);
    
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    setUser(response.data.user);
    setIsAuthenticated(true);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Login successful:", response.data.user);
    }
    
    router.push('/tasks');
  };

  const register = async (data: AuthFormData) => {
    const registerData: RegisterRequest = {
      username: data.username,
      password: data.password,
    };

    const response = await api.post<AuthResponse>('/auth/register', registerData);
    
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    setUser(response.data.user);
    setIsAuthenticated(true);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Registration successful:", response.data.user);
    }
    
    router.push('/tasks');
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('User logged out');
    }
    
    router.push('/');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}