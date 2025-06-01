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
    <div 
      className={`border rounded-md p-3 ${className}`}
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'var(--destructive)',
      }}
    >
      <p className="text-sm" style={{ color: 'var(--destructive)' }}>{message}</p>
    </div>
  );
}