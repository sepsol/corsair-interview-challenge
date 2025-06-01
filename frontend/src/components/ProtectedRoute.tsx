"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { User } from "@task-manager/shared";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Props for the ProtectedRoute component
 */
interface ProtectedRouteProps {
  /** The protected content to render if authenticated */
  children: ReactNode;
  /** Optional callback when user data is loaded */
  onUserLoaded?: (user: User) => void;
}

/**
 * Higher-order component that protects routes from unauthenticated access
 * 
 * Features:
 * - Checks for valid authentication token and user data
 * - Redirects unauthenticated users to root page (which goes to login)
 * - Handles corrupted or invalid authentication data
 * - Shows loading state during authentication check
 * - Provides user data to child components via callback
 * 
 * @param props - The component props
 * @returns Protected content or loading spinner during auth check
 * 
 * @example
 * ```tsx
 * <ProtectedRoute onUserLoaded={setUser}>
 *   <TasksPage />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({ children, onUserLoaded }: ProtectedRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check for required authentication data
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
          if (process.env.NODE_ENV === 'development') {
            console.log('No authentication found, redirecting to root');
          }
          router.push('/');
          return;
        }

        // Validate and parse user data
        let userData: User;
        try {
          userData = JSON.parse(storedUser);
        } catch (parseError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Invalid stored user data:', parseError);
          }
          // Clear corrupted data and redirect
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          router.push('/');
          return;
        }

        // Authentication successful
        setIsAuthenticated(true);
        
        // Notify parent component of loaded user
        if (onUserLoaded) {
          onUserLoaded(userData);
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Authentication verified for user:', userData.username);
        }
        
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Authentication check failed:', error);
        }
        // Clear any potentially corrupted data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    };

    checkAuthentication();
  }, [router, onUserLoaded]);

  // Show loading spinner while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect is in progress)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}