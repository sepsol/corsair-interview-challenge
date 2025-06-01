import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

/**
 * Props for the TextArea component
 */
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Additional CSS classes */
  className?: string;
  /** Whether the textarea has an error */
  error?: boolean;
}

/**
 * A reusable textarea component with consistent dark theme styling
 * 
 * Features:
 * - Consistent dark theme styling matching TextInput
 * - Focus states with ring and border transitions
 * - Error states with red styling and shadow
 * - Disabled state styling
 * - Vertical resize only for better UX
 * - Supports all standard textarea props via extension
 * - Forward ref support for form libraries
 * 
 * @param props - Standard textarea props plus optional className
 * @returns A styled textarea element
 * 
 * @example
 * ```tsx
 * <TextArea 
 *   placeholder="Enter description..."
 *   value={value}
 *   onChange={handleChange}
 *   rows={3}
 *   disabled={isLoading}
 * />
 * ```
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  className,
  error,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full px-3 py-2 bg-neutral-700 border rounded-md',
        'text-neutral-100 placeholder-neutral-400',
        'focus:outline-none focus:ring-2 focus:border-transparent',
        'resize-vertical disabled:opacity-50 disabled:cursor-not-allowed',
        // Error states
        {
          'border-red-500 focus:ring-red-500 shadow-sm shadow-red-500/25': error,
          'border-neutral-700 focus:ring-neutral-400': !error,
        },
        className
      )}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;