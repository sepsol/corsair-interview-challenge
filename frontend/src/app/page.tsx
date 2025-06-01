"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

/**
 * Root page component that handles authentication-based routing
 * 
 * Features:
 * - Redirects to /login if no authenticated user
 * - Redirects to /tasks if authenticated user exists
 * - Shows loading state during redirect
 * 
 * @returns Loading spinner while checking authentication
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication token and user data
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');
    
    let hasValidAuth = false;
    
    if (token && storedUser) {
      try {
        // Validate that user data can be parsed
        JSON.parse(storedUser);
        hasValidAuth = true;
      } catch (err) {
        // Invalid user data, clear it
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        if (process.env.NODE_ENV === 'development') {
          console.error('Invalid stored user data:', err);
        }
      }
    }
    
    // Redirect based on authentication status
    if (hasValidAuth) {
      router.push('/tasks');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LoadingSpinner message="Checking authentication..." />
    </div>
  );
}
