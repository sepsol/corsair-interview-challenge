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
        'w-full px-3 py-2 bg-neutral-800 border rounded-md',
        'text-neutral-100 placeholder-neutral-500',
        'focus:outline-none focus:ring-2 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
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

TextInput.displayName = 'TextInput';

export default TextInput;