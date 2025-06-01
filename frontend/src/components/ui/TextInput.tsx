import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

/**
 * Props for the TextInput component
 */
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Additional CSS classes */
  className?: string;
  /** Whether the input has an error */
  error?: boolean;
}

/**
 * A reusable text input component with consistent dark theme styling
 * 
 * Features:
 * - Consistent dark theme styling
 * - Focus states with ring and border transitions
 * - Error states with red styling and shadow
 * - Disabled state styling
 * - Supports all standard input props via extension
 * - Forward ref support for form libraries
 * 
 * @param props - Standard input props plus optional className
 * @returns A styled text input element
 * 
 * @example
 * ```tsx
 * <TextInput 
 *   type="text"
 *   placeholder="Enter text..."
 *   value={value}
 *   onChange={handleChange}
 *   disabled={isLoading}
 * />
 * ```
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  className,
  error,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full px-3 py-2 border rounded-md',
        'focus:outline-none focus:ring-2 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
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

TextInput.displayName = 'TextInput';

export default TextInput;