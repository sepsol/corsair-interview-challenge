"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

/**
 * Custom 404 Not Found page component
 * 
 * Features:
 * - Consistent styling with the rest of the application
 * - Authentication-aware navigation (directs to appropriate page)
 * - Theme switcher in top-right corner
 * - Clear call-to-action buttons
 * - Responsive design
 * 
 * @returns The 404 error page component
 */
export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      router.push('/tasks');
    } else {
      router.push('/login');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative" style={{ backgroundColor: 'var(--background)' }}>
      {/* Theme switcher */}
      <div className="absolute top-6 right-6">
        <ThemeSwitcher />
      </div>

      {/* 404 Content */}
      <div className="max-w-md w-full text-center space-y-8">
        {/* Large 404 Icon */}
        <div className="text-8xl mb-6" role="img" aria-label="Page not found">
          🔍
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
            404
          </h1>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
            Page Not Found
          </h2>
          <p className="text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoHome}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {isAuthenticated ? 'Go to Tasks' : 'Go to Login'}
          </Button>
          <Button
            onClick={handleGoBack}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Go Back
          </Button>
        </div>

      </div>
    </div>
  );
}