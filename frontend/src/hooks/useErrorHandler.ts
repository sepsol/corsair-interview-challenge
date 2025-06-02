import { useState } from 'react';
import axios from 'axios';

/**
 * A reusable hook for handling errors consistently across the application
 * 
 * @returns Object containing error state and handler functions
 */
export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle an error by extracting a meaningful error message
   * @param err - The error to handle
   * @param fallbackMessage - Default message if error extraction fails
   */
  const handleError = (err: unknown, fallbackMessage: string = "An unexpected error occurred") => {
    let errorMessage = fallbackMessage;
    
    if (axios.isAxiosError(err)) {
      errorMessage = err.response?.data?.error || err.message || fallbackMessage;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', errorMessage, err);
    }
  };

  /**
   * Execute an async operation with loading state and error handling
   * @param operation - The async operation to execute
   * @param errorMessage - Custom error message for this operation
   * @returns Promise that resolves with the operation result or rejects with handled error
   */
  const executeWithHandling = async <T>(
    operation: () => Promise<T>,
    errorMessage?: string
  ): Promise<T> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await operation();
      return result;
    } catch (err) {
      handleError(err, errorMessage);
      throw err; // Re-throw for caller to handle if needed
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear the current error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Set loading state manually (useful for operations handled elsewhere)
   */
  const setLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  return {
    error,
    isLoading,
    handleError,
    executeWithHandling,
    clearError,
    setLoadingState,
  };
}