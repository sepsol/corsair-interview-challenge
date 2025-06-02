import { useState } from 'react';

/**
 * A reusable hook for managing modal state
 * 
 * @param initialOpen - Initial open state (default: false)
 * @returns Object containing modal state and control functions
 */
export function useModal(initialOpen: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

/**
 * A more advanced modal hook that can manage multiple modal states
 * 
 * @param modalNames - Array of modal names to manage
 * @returns Object containing state and control functions for each modal
 */
export function useMultiModal<T extends string>(modalNames: T[]) {
  const [openModals, setOpenModals] = useState<Set<T>>(new Set());

  const openModal = (name: T) => {
    setOpenModals(prev => new Set(prev).add(name));
  };

  const closeModal = (name: T) => {
    setOpenModals(prev => {
      const newSet = new Set(prev);
      newSet.delete(name);
      return newSet;
    });
  };

  const isModalOpen = (name: T) => openModals.has(name);

  const closeAllModals = () => {
    setOpenModals(new Set());
  };

  // Create a convenient object with all modal controls
  const modals = modalNames.reduce((acc, name) => {
    acc[name] = {
      isOpen: isModalOpen(name),
      open: () => openModal(name),
      close: () => closeModal(name),
    };
    return acc;
  }, {} as Record<T, { isOpen: boolean; open: () => void; close: () => void }>);

  return {
    modals,
    openModal,
    closeModal,
    isModalOpen,
    closeAllModals,
  };
}