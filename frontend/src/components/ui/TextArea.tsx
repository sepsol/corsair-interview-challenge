import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

/**
 * Props for the TextArea component
 */
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * A reusable textarea component with consistent dark theme styling
 * 
 * Features:
 * - Consistent dark theme styling matching TextInput
 * - Focus states with ring and border transitions
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
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md',
        'text-neutral-100 placeholder-neutral-500',
        'focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent',
        'resize-vertical disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;