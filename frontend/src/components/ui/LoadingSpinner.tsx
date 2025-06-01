/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Custom message to display below the spinner */
  message?: string;
  /** Whether to render as a full-page loading state or content-area loading */
  fullPage?: boolean;
}

/**
 * A reusable loading spinner component with customizable display modes
 * 
 * @param props - The component props
 * @returns A loading spinner with optional message
 * 
 * @example
 * ```tsx
 * // Content area loading
 * <LoadingSpinner message="Loading tasks..." />
 * 
 * // Full page loading
 * <LoadingSpinner message="Loading..." fullPage />
 * ```
 */
export default function LoadingSpinner({ 
  message = "Loading...", 
  fullPage = false 
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-700 border-t-neutral-400 mx-auto mb-4"></div>
          <p className="text-neutral-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-neutral-400 mx-auto mb-3"></div>
        <p className="text-neutral-400 text-sm">{message}</p>
      </div>
    </div>
  );
}