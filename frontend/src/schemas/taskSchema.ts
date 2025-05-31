import * as yup from 'yup';

/**
 * Validation schema for task creation and editing forms
 * 
 * Uses yup for schema validation with the following rules:
 * - title: Required string, trimmed, minimum 1 character, maximum 100 characters
 * - description: Optional string, trimmed, maximum 500 characters
 */
export const taskFormSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .min(1, 'Title cannot be empty')
    .max(100, 'Title must be 100 characters or less'),
  
  description: yup
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or less')
    .default('')
});

/**
 * TypeScript type inferred from the yup schema
 * This ensures type safety between the schema and form data
 */
export type TaskFormData = yup.InferType<typeof taskFormSchema>;