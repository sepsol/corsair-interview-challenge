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
  const getButtonStyles = () => {
    const baseStyle = {
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: '1px solid var(--primary)',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--secondary)',
          color: 'var(--secondary-foreground)',
          border: '1px solid var(--border)',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: 'var(--destructive)',
          color: 'var(--destructive-foreground)',
          border: '1px solid var(--destructive)',
        };
      case 'danger-outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          color: 'var(--destructive)',
          border: '1px solid var(--destructive)',
        };
      default:
        return baseStyle;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    switch (variant) {
      case 'primary':
        e.currentTarget.style.opacity = '0.8';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        break;
      case 'secondary':
        e.currentTarget.style.backgroundColor = 'var(--accent)';
        e.currentTarget.style.borderColor = 'var(--accent)';
        break;
      case 'danger':
        e.currentTarget.style.opacity = '0.9';
        break;
      case 'danger-outline':
        e.currentTarget.style.backgroundColor = 'var(--destructive)';
        e.currentTarget.style.color = 'var(--destructive-foreground)';
        e.currentTarget.style.borderColor = 'var(--destructive)';
        break;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    const styles = getButtonStyles();
    Object.assign(e.currentTarget.style, styles);
    e.currentTarget.style.opacity = '';
    e.currentTarget.style.boxShadow = '';
  };

  return (
    <button
      className={clsx(
        // Base styles
        'inline-flex items-center justify-center font-medium rounded-md focus:outline-none border box-border',
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
      style={getButtonStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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