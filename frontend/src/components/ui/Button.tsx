import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Props for the Button component
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Content to display inside the button */
  children: ReactNode;
  /** Visual style variant of the button */
  variant?: 'primary' | 'secondary' | 'danger' | 'danger-outline';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the button is in a loading state */
  loading?: boolean;
}

/**
 * A reusable button component with consistent styling and variants
 * 
 * Features:
 * - Multiple variants (primary, secondary, danger, danger-outline)
 * - Different sizes (sm, md, lg)
 * - Loading state with spinner
 * - Full accessibility support
 * - Consistent dark theme styling
 * 
 * @param props - The component props
 * @returns A styled button element
 * 
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Save Task
 * </Button>
 * 
 * <Button variant="secondary" size="sm" loading>
 *   Loading...
 * </Button>
 * ```
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
        // Variant styles (with conditional hover effects)
        {
          // Primary variant
          'bg-neutral-200 text-neutral-900 focus:ring-neutral-400': variant === 'primary',
          'hover:bg-neutral-400': variant === 'primary' && !disabled && !loading,
          
          // Secondary variant
          'bg-neutral-700 text-neutral-200 border border-neutral-700 focus:ring-neutral-400': variant === 'secondary',
          'hover:bg-neutral-900 hover:border-neutral-400': variant === 'secondary' && !disabled && !loading,
          
          // Danger variant
          'bg-red-600 text-white focus:ring-red-500': variant === 'danger',
          'hover:bg-red-700': variant === 'danger' && !disabled && !loading,
          
          // Danger outline variant (GitHub-style)
          'text-red-400 border border-red-400/30 bg-transparent focus:ring-red-500': variant === 'danger-outline',
          'hover:bg-red-600 hover:text-white hover:border-red-600': variant === 'danger-outline' && !disabled && !loading,
        },
        // Size styles
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        // Cursor and state styles
        {
          'cursor-pointer': !disabled && !loading,
          'cursor-not-allowed': disabled && !loading,
          'cursor-default': loading,
          'opacity-50': disabled || loading,
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className={clsx(
          'animate-spin rounded-full border-2 border-current border-t-transparent mr-2',
          {
            'h-3 w-3': size === 'sm',
            'h-4 w-4': size === 'md',
            'h-5 w-5': size === 'lg',
          }
        )} />
      )}
      {children}
    </button>
  );
}