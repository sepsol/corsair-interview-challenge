import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import styles from '@/components/ui/Modal.module.scss';

/**
 * Props for the Modal component
 */
interface ModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Function to call when the modal should be closed */
  onClose: () => void;
  /** Optional title to display in the modal header */
  title?: string;
  /** The content to display in the modal body */
  children: ReactNode;
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * A reusable modal component with backdrop blur and consistent styling
 * 
 * Features:
 * - Backdrop blur effect
 * - Escape key to close
 * - Click outside to close
 * - Multiple size options
 * - Consistent dark theme styling
 * - Body scroll lock when open
 * - Smooth animations
 * 
 * @param props - The component props
 * @returns A modal overlay with content
 * 
 * @example
 * ```tsx
 * <Modal 
 *   isOpen={isModalOpen} 
 *   onClose={() => setIsModalOpen(false)}
 *   title="Create Task"
 *   size="md"
 * >
 *   <div>Modal content here</div>
 * </Modal>
 * ```
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Handle modal state changes
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      // Wait for exit animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 150); // Match exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={clsx(
            'fixed inset-0 backdrop-blur-sm',
            isClosing ? styles.backdropExit : styles.backdropEnter
          )}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal */}
        <div
          className={clsx(
            'relative border rounded-lg shadow-xl w-full transform',
            isClosing ? styles.modalExit : styles.modalEnter,
            {
              'max-w-sm': size === 'sm',
              'max-w-md': size === 'md', 
              'max-w-lg': size === 'lg',
              'max-w-2xl': size === 'xl',
            }
          )}
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div 
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderBottomColor: 'var(--border)' }}
            >
              <h2 
                className="text-lg font-semibold" 
                style={{ color: 'var(--foreground)' }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-md transition-colors cursor-pointer"
                style={{ color: 'var(--muted-foreground)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--foreground)';
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--muted-foreground)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}