"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm, { AuthFormData } from "@/components/AuthForm";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

/**
 * Login page component with centered form
 * 
 * Features:
 * - Uses reusable AuthForm component
 * - Uses AuthContext for login functionality
 * - Centered layout with responsive design
 * - Loading states and error handling
 * 
 * @returns The login page component
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await login(data);
      
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(err)) {
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
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute top-6 right-6">
        <ThemeSwitcher />
      </div>
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        error={error}
        loading={isLoading}
        onSwitchAuthMode={handleNavigateToRegister}
        hint="Demo credentials: defaultuser / password123"
      />
    </div>
  );
}