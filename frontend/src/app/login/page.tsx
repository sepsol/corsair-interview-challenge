"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
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
  const { login } = useAuth();
  const { error, isLoading, executeWithHandling, setLoadingState } = useErrorHandler();
  const router = useRouter();

  const handleLogin = async (data: AuthFormData) => {
    try {
      await executeWithHandling(
        () => login(data),
        "Login failed"
      );
      // Keep loading state active during navigation
      setLoadingState(true);
    } catch (err) {
      // Error is already handled by executeWithHandling
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
        hint="Default demo credentials: defaultuser / password123"
      />
    </div>
  );
}