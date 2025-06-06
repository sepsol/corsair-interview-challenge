import { ReactNode, cloneElement, isValidElement } from 'react';

/**
 * Props for the FormField component
 */
interface FormFieldProps {
  /** Label text for the field */
  label: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error message to display */
  error?: string;
  /** The form control element (input, textarea, select, etc.) */
  children: ReactNode;
}

/**
 * A reusable form field wrapper that provides consistent styling and layout
 * 
 * Features:
 * - Consistent label styling with optional required indicator
 * - Error state styling and message display
 * - Disabled state support
 * - Dark theme compatible
 * 
 * @param props - The component props
 * @returns A form field with label and error handling
 * 
 * @example
 * ```tsx
 * <FormField label="Email" required error={emailError}>
 *   <input 
 *     type="email" 
 *     value={email}
 *     onChange={(e) => setEmail(e.target.value)}
 *   />
 * </FormField>
 * ```
 */
export default function FormField({
  label,
  required = false,
  disabled = false,
  error,
  children
}: FormFieldProps) {
  return (
    <div>
      <label 
        className="block text-sm font-medium mb-2"
        style={{ 
          color: disabled ? 'var(--muted-foreground)' : 'var(--foreground)' 
        }}
      >
        {label}
        {required && <span className="ml-1" style={{ color: 'var(--destructive)' }}>*</span>}
      </label>
      
      <div className={error ? 'mb-1' : ''}>
        {isValidElement(children) 
          ? cloneElement(children, { error: Boolean(error) } as { error: boolean })
          : children
        }
      </div>
      
      {error && (
        <p className="text-xs mt-1" style={{ color: 'var(--destructive)' }}>{error}</p>
      )}
    </div>
  );
}