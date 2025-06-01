"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import AuthForm, { AuthFormData } from "@/components/AuthForm";

/**
 * Register page component with centered form
 * 
 * Features:
 * - Uses reusable AuthForm component in register mode
 * - Uses AuthContext for registration functionality
 * - Automatically logs user in after successful registration
 * - Centered layout with responsive design
 * - Loading states and error handling
 * - Form validation handled by AuthForm
 * 
 * @returns The register page component
 */
export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      await register(data);
      
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (axios.isAxiosError(err)) {
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