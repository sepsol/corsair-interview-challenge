import Modal from './Modal';
import Button from './Button';

/**
 * Props for the ConfirmationModal component
 */
interface ConfirmationModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Function to call when the user confirms the action */
  onConfirm: () => void;
  /** Title of the confirmation modal */
  title: string;
  /** Main message describing what will happen */
  message: string;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Whether the confirmation action is currently processing */
  isLoading?: boolean;
  /** Variant of the confirm button */
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'danger-outline';
}

/**
 * A reusable confirmation modal component for dangerous or important actions
 * 
 * Features:
 * - Consistent styling with our modal system
 * - Customizable title, message, and button text
 * - Loading states during confirmation processing
 * - Keyboard accessible (Escape to cancel)
 * - Different button variants for different action types
 * 
 * @param props - The component props
 * @returns A confirmation modal with confirm/cancel actions
 * 
 * @example
 * ```tsx
 * <ConfirmationModal
 *   isOpen={isDeleteModalOpen}
 *   onClose={handleCloseDeleteModal}
 *   onConfirm={handleConfirmDelete}
 *   title="Delete Task"
 *   message="Are you sure you want to delete this task? This action cannot be undone."
 *   confirmText="Delete"
 *   confirmVariant="danger-outline"
 *   isLoading={isDeleting}
 * />
 * ```
 */
export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  confirmVariant = 'danger-outline'
}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        {/* Message */}
        <p className="text-neutral-200 text-sm leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onConfirm}
            variant={confirmVariant}
            loading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}