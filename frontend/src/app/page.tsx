"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthLoadingScreen from "@/components/ui/AuthLoadingScreen";

/**
 * Root page component that handles authentication-based routing
 * 
 * Features:
 * - Redirects to /login if no authenticated user
 * - Redirects to /tasks if authenticated user exists
 * - Uses AuthContext for authentication state
 * 
 * @returns Loading spinner while checking authentication
 */
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/tasks');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return <AuthLoadingScreen />;
}
