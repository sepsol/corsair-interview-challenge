import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

/**
 * Props for the Checkbox component
 */
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Size of the checkbox */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the checkbox is in loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A custom checkbox component with consistent dark theme styling
 * 
 * Features:
 * - Custom styling that replaces default browser checkbox
 * - Multiple sizes (sm, md, lg)
 * - Loading state with centered spinner
 * - Smooth animations for state changes
 * - Accessible with proper focus states
 * - Dark theme compatible
 * - Checkmark icon when checked
 * 
 * @param props - Standard input props plus custom styling options
 * @returns A styled checkbox element
 * 
 * @example
 * ```tsx
 * <Checkbox 
 *   checked={isCompleted}
 *   loading={isUpdating}
 *   onChange={handleToggle}
 *   size="lg"
 * />
 * ```
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  checked = false,
  size = 'md',
  loading = false,
  className,
  disabled,
  onChange,
  ...props
}, ref) => {
  const handleClick = () => {
    if (!disabled && !loading && onChange) {
      // Create a synthetic event that matches what the input would produce
      const syntheticEvent = {
        target: { checked: !checked },
        currentTarget: { checked: !checked }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.borderColor = 'var(--ring)';
      if (!checked) {
        e.currentTarget.style.backgroundColor = 'var(--accent)';
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.borderColor = 'var(--border)';
      if (!checked) {
        e.currentTarget.style.backgroundColor = 'var(--background)';
      } else {
        e.currentTarget.style.backgroundColor = 'var(--primary)';
      }
    }
  };

  // Compute size-related values
  const sizeClasses = {
    'w-4 h-4': size === 'sm',
    'w-5 h-5': size === 'md',
    'w-6 h-6': size === 'lg',
  };

  const iconSizeClasses = {
    'w-2.5 h-2.5': size === 'sm',
    'w-3 h-3': size === 'md',
    'w-3.5 h-3.5': size === 'lg',
  };

  const spinnerSizeClasses = {
    'w-2.5 h-2.5': size === 'sm',
    'w-3 h-3': size === 'md',
    'w-3.5 h-3.5': size === 'lg',
  };

  const minDimensions = {
    minWidth: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
    minHeight: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
  };

  // Compute cursor classes
  const cursorClasses = {
    'cursor-pointer': !disabled && !loading,
    'cursor-not-allowed': disabled,
    'cursor-wait': loading,
  };

  // Compute styles
  const checkboxStyle = {
    borderColor: 'var(--border)',
    borderWidth: '2px',
    backgroundColor: checked && !disabled && !loading ? 'var(--primary)' : 'var(--background)',
    opacity: disabled ? 0.5 : 1,
    ...minDimensions,
  };

  const iconStyle = {
    color: 'var(--primary-foreground)',
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled || loading}
        className="sr-only"
        onChange={onChange}
        {...props}
      />
      <div
        onClick={handleClick}
        className={clsx(
          'relative flex items-center justify-center border-2 rounded-md transition-colors duration-200 box-border flex-shrink-0',
          sizeClasses,
          cursorClasses,
          className
        )}
        style={checkboxStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {loading ? (
          <div 
            className={clsx(
              'border-2 rounded-full animate-spin',
              spinnerSizeClasses
            )}
            style={{ 
              borderColor: 'var(--muted-foreground)',
              borderTopColor: 'transparent'
            }}
          />
        ) : checked ? (
          <svg
            className={clsx(iconSizeClasses)}
            style={iconStyle}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : null}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;