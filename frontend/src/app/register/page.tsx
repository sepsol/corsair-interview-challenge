"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import AuthForm, { AuthFormData } from "@/components/AuthForm";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

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
  const { register } = useAuth();
  const { error, isLoading, executeWithHandling, setLoadingState } = useErrorHandler();
  const router = useRouter();

  const handleRegister = async (data: AuthFormData) => {
    try {
      await executeWithHandling(
        () => register(data),
        "Registration failed"
      );
      // Keep loading state active during navigation
      setLoadingState(true);
    } catch (err) {
      // Error is already handled by executeWithHandling
    }
  };

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute top-6 right-6">
        <ThemeSwitcher />
      </div>
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