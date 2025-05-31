import { useState } from 'react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import ErrorMessage from '@/components/ui/ErrorMessage';
import TextInput from '@/components/ui/TextInput';
import TextArea from '@/components/ui/TextArea';

/**
 * Form data structure for task creation
 */
export interface TaskFormData {
  title: string;
  description: string;
}

/**
 * Props for the TaskForm component
 */
interface TaskFormProps {
  /** Function called when form is submitted with valid data */
  onSubmit: (data: TaskFormData) => Promise<void>;
  /** Function called when cancel button is clicked */
  onCancel: () => void;
  /** Whether the form is currently submitting */
  isSubmitting?: boolean;
  /** Initial form data (for editing) */
  initialData?: Partial<TaskFormData>;
}

/**
 * A reusable task form component for creating and editing tasks
 * 
 * Features:
 * - Form validation (title required, description optional)
 * - Loading states during submission
 * - Error handling and display
 * - Accessible form controls
 * - Consistent styling with dark theme
 * 
 * @param props - The component props
 * @returns A complete task form with validation and submission handling
 * 
 * @example
 * ```tsx
 * <TaskForm
 *   onSubmit={handleCreateTask}
 *   onCancel={handleCloseModal}
 *   isSubmitting={isCreating}
 * />
 * ```
 */
export default function TaskForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData = {}
}: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: initialData.title || '',
    description: initialData.description || ''
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      setSubmitError('Title is required');
      return;
    }

    try {
      setSubmitError(null);
      await onSubmit({
        title: formData.title.trim(),
        description: formData.description.trim()
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
    // Clear error when user starts typing
    if (submitError) setSubmitError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  };

  return (
    <div className="space-y-4">
      {/* Error Message */}
      {submitError && (
        <ErrorMessage message={submitError} />
      )}

      {/* Title Input */}
      <FormField label="Title" required disabled={isSubmitting}>
        <TextInput
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
          disabled={isSubmitting}
          placeholder="Enter task title..."
          required
        />
      </FormField>

      {/* Description Input */}
      <FormField label="Description" disabled={isSubmitting}>
        <TextArea
          value={formData.description}
          onChange={handleDescriptionChange}
          disabled={isSubmitting}
          rows={3}
          placeholder="Enter task description (optional)..."
        />
      </FormField>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="flex-1"
        >
          Create Task
        </Button>
        <Button
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}