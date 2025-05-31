/**
 * Props for the ErrorState component
 */
interface ErrorStateProps {
  /** The error message to display */
  message: string;
  /** Optional custom title for the error state */
  title?: string;
}

/**
 * A reusable error state component for displaying errors with consistent styling
 * 
 * @param props - The component props
 * @returns An error display with icon, title, and message
 * 
 * @example
 * ```tsx
 * // Default error state
 * <ErrorState message="Failed to load data" />
 * 
 * // Custom title
 * <ErrorState 
 *   title="Network Error" 
 *   message="Unable to connect to server" 
 * />
 * ```
 */
export default function ErrorState({ message, title = "Error loading tasks" }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">{title}</h2>
        <p className="text-neutral-500">{message}</p>
      </div>
    </div>
  );
}