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
  /** Additional CSS classes */
  className?: string;
}

/**
 * A custom checkbox component with consistent dark theme styling
 * 
 * Features:
 * - Custom styling that replaces default browser checkbox
 * - Multiple sizes (sm, md, lg)
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
 *   onChange={handleToggle}
 *   size="lg"
 * />
 * ```
 */
const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  checked = false,
  size = 'md',
  className,
  disabled,
  onChange,
  ...props
}, ref) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      // Create a synthetic event that matches what the input would produce
      const syntheticEvent = {
        target: { checked: !checked },
        currentTarget: { checked: !checked }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        className="sr-only"
        onChange={onChange}
        {...props}
      />
      <div
        onClick={handleClick}
        className={clsx(
          'relative flex items-center justify-center border-2 rounded-md transition-colors duration-200 box-border',
          // Size variants
          {
            'w-4 h-4': size === 'sm',
            'w-5 h-5': size === 'md',
            'w-6 h-6': size === 'lg',
          },
          // Cursor
          {
            'cursor-pointer': !disabled,
            'cursor-not-allowed': disabled,
          },
          className
        )}
        style={{
          borderColor: 'var(--border)',
          borderWidth: '2px',
          backgroundColor: checked && !disabled 
            ? 'var(--primary)' 
            : 'var(--background)',
          opacity: disabled ? 0.5 : 1,
          minWidth: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
          minHeight: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = 'var(--ring)';
            if (!checked) {
              e.currentTarget.style.backgroundColor = 'var(--accent)';
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = 'var(--border)';
            if (!checked) {
              e.currentTarget.style.backgroundColor = 'var(--background)';
            } else {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
            }
          }
        }}
      >
        {/* Checkmark icon */}
        {checked && (
          <svg
            className={clsx({
              'w-2.5 h-2.5': size === 'sm',
              'w-3 h-3': size === 'md',
              'w-3.5 h-3.5': size === 'lg',
            })}
            style={{ color: 'var(--primary-foreground)' }}
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
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;