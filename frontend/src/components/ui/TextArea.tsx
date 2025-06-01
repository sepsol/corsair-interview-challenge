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
        'w-full px-3 py-2 border rounded-md',
        'focus:outline-none focus:ring-2 focus:border-transparent',
        'resize-vertical disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      style={{
        backgroundColor: 'var(--input)',
        borderColor: error ? 'var(--destructive)' : 'var(--border)',
        color: 'var(--foreground)',
        ...(error && {
          boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.2)',
        })
      }}
      onFocus={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = 'var(--ring)';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(15, 23, 42, 0.1)';
        }
      }}
      onBlur={(e) => {
        if (!error) {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;