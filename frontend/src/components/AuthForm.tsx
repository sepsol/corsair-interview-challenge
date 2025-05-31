"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, registerSchema, AuthFormData } from "@/schemas/authSchema";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import ErrorMessage from "@/components/ui/ErrorMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export type { AuthFormData };

/**
 * Props for the AuthForm component
 */
interface AuthFormProps {
  /** The type of form - determines validation schema and UI text */
  mode: "login" | "register";
  /** Callback function called when form is submitted with valid data */
  onSubmit: (data: AuthFormData) => Promise<void>;
  /** Optional initial form data */
  initialData?: Partial<AuthFormData>;
  /** Optional error message to display */
  error?: string | null;
  /** Whether the form is in a loading state */
  loading?: boolean;
}

/**
 * Reusable authentication form component for login and register
 * 
 * Features:
 * - Supports both login and register modes
 * - Form validation with yup and react-hook-form
 * - Loading states and error handling
 * - Consistent styling with existing UI components
 * - Responsive design
 * 
 * @param props - The component props
 * @returns A complete authentication form
 */
export default function AuthForm({
  mode,
  onSubmit,
  initialData,
  error,
  loading = false,
}: AuthFormProps) {
  const isRegister = mode === "register";
  const schema = isRegister ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: AuthFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Error handling is managed by parent component
      console.error(`${mode} error:`, err);
    }
  };

  const formTitle = isRegister ? "Create your account" : "Sign in to your account";
  const formDescription = isRegister 
    ? "Join us! Please enter your details to create an account."
    : "Welcome back! Please enter your credentials.";
  const submitButtonText = isRegister ? "Create account" : "Sign in";
  const loadingMessage = isRegister ? "Creating account..." : "Signing in...";

  return (
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-100">
          {formTitle}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {formDescription}
        </p>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner message={loadingMessage} />
        </div>
      )}

      {/* Auth form */}
      {!loading && (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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
            loading={loading}
          >
            {submitButtonText}
          </Button>
        </form>
      )}

      {/* Additional info */}
      <div className="text-center">
        <p className="text-sm text-neutral-500">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span className="text-neutral-400 hover:text-neutral-300 cursor-pointer transition-colors">
                Sign in
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span className="text-neutral-400 hover:text-neutral-300 cursor-pointer transition-colors">
                Sign up
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}