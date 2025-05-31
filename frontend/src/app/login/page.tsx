"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Validation schema for login form
const loginSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

/**
 * Login page component with centered form
 * 
 * Features:
 * - Centered login form with validation
 * - Loading states during submission
 * - Error handling and display
 * - Form validation with yup and react-hook-form
 * - Responsive design
 * 
 * @returns The login page component
 */
export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
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
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-neutral-100">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Welcome back! Please enter your credentials.
          </p>
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner message="Signing in..." />
          </div>
        )}

        {/* Login form */}
        {!isLoading && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Error message */}
            {error && (
              <ErrorMessage message={error} />
            )}

            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">
                Username
              </label>
              <TextInput
                id="username"
                type="text"
                placeholder="Enter your username"
                error={!!errors.username}
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
                Password
              </label>
              <TextInput
                id="password"
                type="password"
                placeholder="Enter your password"
                error={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Sign in
            </Button>
          </form>
        )}

        {/* Additional info */}
        <div className="text-center">
          <p className="text-sm text-neutral-500">
            Don't have an account?{" "}
            <span className="text-neutral-400 hover:text-neutral-300 cursor-pointer transition-colors">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}