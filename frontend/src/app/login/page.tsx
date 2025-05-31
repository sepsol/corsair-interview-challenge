"use client";

import { useState } from "react";
import AuthForm, { AuthFormData } from "@/components/AuthForm";

/**
 * Login page component with centered form
 * 
 * Features:
 * - Uses reusable AuthForm component
 * - Centered layout with responsive design
 * - Loading states and error handling
 * - Form validation handled by AuthForm
 * 
 * @returns The login page component
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Replace with actual API call to /api/auth/login
      console.log("Login attempt:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success/error for testing
      if (data.username === "demo" && data.password === "password") {
        console.log("Login successful");
        // TODO: Handle successful login (redirect, store token, etc.)
      } else {
        throw new Error("Invalid credentials");
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Login error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-12">
      <AuthForm
        mode="login"
        onSubmit={handleLogin}
        error={error}
        loading={isLoading}
      />
    </div>
  );
}