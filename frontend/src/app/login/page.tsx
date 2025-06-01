"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LoginRequest, AuthResponse } from "@task-manager/shared";
import AuthForm, { AuthFormData } from "@/components/AuthForm";
import api from "@/services/api";

/**
 * Login page component with centered form
 * 
 * Features:
 * - Uses reusable AuthForm component
 * - Calls actual login API endpoint
 * - Stores authentication token on success
 * - Redirects to tasks page after successful login
 * - Centered layout with responsive design
 * - Loading states and error handling
 * 
 * @returns The login page component
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the login API
      const loginData: LoginRequest = {
        username: data.username,
        password: data.password,
      };

      const response = await api.post<AuthResponse>('/auth/login', loginData);
      
      // Store the authentication token
      localStorage.setItem('auth_token', response.data.token);
      
      // Store user information (optional)
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Login successful:", response.data.user);
      }
      
      // Redirect to tasks page
      router.push('/tasks');
      
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(err)) {
        // Handle Axios-specific errors
        errorMessage = err.response?.data?.error || err.message || "Login failed";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error("Login error:", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        error={error}
        loading={isLoading}
        onSwitchAuthMode={handleNavigateToRegister}
      />
    </div>
  );
}