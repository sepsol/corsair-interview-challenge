import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import ErrorMessage from '@/components/ui/ErrorMessage';
import TextInput from '@/components/ui/TextInput';
import TextArea from '@/components/ui/TextArea';
import { taskFormSchema, TaskFormData } from '@/schemas/taskSchema';

/**
 * Props for the TaskForm component
 */
interface TaskFormProps {
  /** Function called when form is submitted with valid data */
  onSubmit: (data: TaskFormData) => Promise<void>;
  /** Function called when cancel button is clicked */
  onCancel: () => void;
  /** Initial form data (for editing) */
  initialData?: Partial<TaskFormData>;
}

/**
 * A reusable task form component for creating and editing tasks
 * 
 * Features:
 * - Schema-based validation using yup
 * - Optimized performance with react-hook-form
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
 *   initialData={{ title: 'Edit this task' }}
 * />
 * ```
 */
export default function TaskForm({
  onSubmit,
  onCancel,
  initialData = {}
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskFormSchema),
    defaultValues: {
      title: initialData.title || '',
      description: initialData.description || ''
    }
  });

  const onFormSubmit = async (data: TaskFormData) => {
    try {
      clearErrors('root');
      await onSubmit(data);
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} noValidate className="space-y-4">
      {/* Global Error Message */}
      {errors.root && (
        <ErrorMessage message={errors.root.message || 'An error occurred'} />
      )}

      {/* Title Input */}
      <FormField 
        label="Title" 
        required 
        disabled={isSubmitting}
        error={errors.title?.message}
      >
        <TextInput
          type="text"
          {...register('title')}
          disabled={isSubmitting}
          placeholder="Enter task title..."
        />
      </FormField>

      {/* Description Input */}
      <FormField 
        label="Description" 
        disabled={isSubmitting}
        error={errors.description?.message}
      >
        <TextArea
          {...register('description')}
          disabled={isSubmitting}
          rows={3}
          placeholder="Enter task description (optional)..."
        />
      </FormField>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="flex-1"
        >
          Create Task
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}