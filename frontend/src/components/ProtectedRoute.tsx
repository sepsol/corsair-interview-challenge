"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthLoadingScreen from "@/components/ui/AuthLoadingScreen";

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** The protected content to render if authenticated */
  children: ReactNode;
}

/**
 * Higher-order component that protects routes from unauthenticated access
 * 
 * Features:
 * - Uses AuthContext for authentication state
 * - Redirects unauthenticated users to root page (which goes to login)
 * - Shows loading state during authentication check
 * - Automatically handles authentication logic via context
 * 
 * @param props - The component props
 * @returns Protected content or loading spinner during auth check
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <TasksPage />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to root page if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No authentication found, redirecting to root');
      }
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  // If not authenticated, return null while redirect happens
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}