"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm, { AuthFormData } from "@/components/AuthForm";

/**
 * Register page component with centered form
 * 
 * Features:
 * - Uses reusable AuthForm component in register mode
 * - Centered layout with responsive design
 * - Loading states and error handling
 * - Form validation handled by AuthForm
 * - Console logging for development (API integration pending)
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

      // TODO: Replace with actual API call to /api/auth/register
      console.log("Register attempt:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success for testing
      console.log("Registration successful for user:", data.username);
      
      // TODO: Handle successful registration (redirect, store token, etc.)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Registration error:", errorMessage);
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