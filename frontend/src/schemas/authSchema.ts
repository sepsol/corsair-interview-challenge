import * as yup from 'yup';

/**
 * Base validation schema for authentication forms
 * 
 * Uses yup for schema validation with the following rules:
 * - username: Required string, trimmed, minimum 3 characters
 * - password: Required string, minimum 6 characters
 */
export const baseAuthSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

/**
 * Login form validation schema
 * Uses the base auth schema for username and password validation
 */
export const loginSchema = baseAuthSchema;

/**
 * Registration form validation schema
 * Extends the base auth schema and can be expanded with additional fields
 * like confirmPassword, email, etc.
 */
export const registerSchema = baseAuthSchema.shape({
  // Future fields can be added here:
  // confirmPassword: yup
  //   .string()
  //   .required('Please confirm your password')
  //   .oneOf([yup.ref('password')], 'Passwords must match'),
  // email: yup
  //   .string()
  //   .email('Please enter a valid email')
  //   .required('Email is required'),
});

/**
 * TypeScript types inferred from the yup schemas
 * These ensure type safety between the schemas and form data
 */
export type AuthFormData = yup.InferType<typeof baseAuthSchema>;
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;