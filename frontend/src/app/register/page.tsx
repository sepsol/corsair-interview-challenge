"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RegisterRequest, AuthResponse } from "@task-manager/shared";
import AuthForm, { AuthFormData } from "@/components/AuthForm";
import api from "@/services/api";

/**
 * Register page component with centered form
 * 
 * Features:
 * - Uses reusable AuthForm component in register mode
 * - Calls actual register API endpoint
 * - Automatically logs user in after successful registration
 * - Redirects to tasks page after successful registration
 * - Centered layout with responsive design
 * - Loading states and error handling
 * - Form validation handled by AuthForm
 * 
 * @returns The register page component
 */
export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the registration API
      const registerData: RegisterRequest = {
        username: data.username,
        password: data.password,
      };

      const response = await api.post<AuthResponse>('/auth/register', registerData);
      
      // Store the authentication token (auto-login)
      localStorage.setItem('auth_token', response.data.token);
      
      // Store user information
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (process.env.NODE_ENV === 'development') {
        console.log("Registration successful:", response.data.user);
      }
      
      // Redirect to tasks page
      router.push('/tasks');
      
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(err)) {
        // Handle Axios-specific errors
        errorMessage = err.response?.data?.error || err.message || "Registration failed";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error("Registration error:", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <AuthForm
        mode="register"
        onSubmit={handleRegister}
        error={error}
        loading={isLoading}
        onSwitchAuthMode={handleNavigateToLogin}
      />
    </div>
  );
}