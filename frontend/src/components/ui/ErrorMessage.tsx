/**
 * Props for the ErrorMessage component
 */
interface ErrorMessageProps {
  /** The error message to display */
  message: string;
  /** Optional custom styling className */
  className?: string;
}

/**
 * A reusable error message component with consistent styling
 * 
 * Features:
 * - Consistent error styling with red theme
 * - Border and background styling for visibility
 * - Dark theme compatible
 * - Optional custom className for additional styling
 * 
 * @param props - The component props
 * @returns A styled error message container
 * 
 * @example
 * ```tsx
 * <ErrorMessage message="Title is required" />
 * ```
 */
export default function ErrorMessage({ message, className = '' }: ErrorMessageProps) {
  return (
    <div className={`bg-red-900/20 border border-red-700/50 rounded-md p-3 ${className}`}>
      <p className="text-red-300 text-sm">{message}</p>
    </div>
  );
}