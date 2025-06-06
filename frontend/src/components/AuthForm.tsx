"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, registerSchema, AuthFormData } from "@/schemas/authSchema";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import ErrorMessage from "@/components/ui/ErrorMessage";

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
  /** Optional callback when user wants to switch between login and register modes */
  onSwitchAuthMode?: () => void;
  /** Optional hint to display below the submit button (only in development) */
  hint?: string;
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
  onSwitchAuthMode,
  hint,
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

  return (
    <div className="max-w-md w-full space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          {formTitle}
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {formDescription}
        </p>
      </div>

      {/* Auth form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Error message */}
        {error && (
          <ErrorMessage message={error} />
        )}

        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Username
          </label>
          <TextInput
            id="username"
            type="text"
            placeholder="Enter your username"
            error={!!errors.username}
            disabled={loading}
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1 text-sm" style={{ color: 'var(--destructive)' }}>{errors.username.message}</p>
          )}
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
            Password
          </label>
          <TextInput
            id="password"
            type="password"
            placeholder="Enter your password"
            error={!!errors.password}
            disabled={loading}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm" style={{ color: 'var(--destructive)' }}>{errors.password.message}</p>
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

      {/* Development hint - only show in development mode and for login */}
      {process.env.NODE_ENV === 'development' && mode === 'login' && hint && (
        <div className="text-center">
          <div 
            className="text-xs px-3 py-2 rounded-md border"
            style={{ 
              backgroundColor: 'var(--muted)', 
              borderColor: 'var(--border)',
              color: 'var(--muted-foreground)'
            }}
          >
            💡 {hint}
          </div>
        </div>
      )}

      {/* Additional info - only show if navigation callback is provided */}
      {onSwitchAuthMode && (
        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span 
                  className="cursor-pointer transition-all duration-200 font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ring)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onClick={onSwitchAuthMode}
                >
                  Sign in
                </span>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <span 
                  className="cursor-pointer transition-all duration-200 font-medium hover:underline"
                  style={{ color: 'var(--primary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--ring)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onClick={onSwitchAuthMode}
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}