import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

/**
 * Props for the TextInput component
 */
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * A reusable text input component with consistent dark theme styling
 * 
 * Features:
 * - Consistent dark theme styling
 * - Focus states with ring and border transitions
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
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md',
        'text-neutral-100 placeholder-neutral-500',
        'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});

TextInput.displayName = 'TextInput';

export default TextInput;