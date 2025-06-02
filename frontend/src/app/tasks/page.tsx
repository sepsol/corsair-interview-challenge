"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TasksContext";
import { Task } from "@task-manager/shared";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageLayout from "@/components/ui/PageLayout";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TaskForm from "@/components/TaskForm";
import { TaskFormData } from "@/schemas/taskSchema";
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";


/**
 * Main tasks page component that displays a list of tasks
 * 
 * Features:
 * - Fetches tasks from the API using axios on component mount
 * - Displays loading state while fetching
 * - Shows error state with detailed axios error handling
 * - Renders empty state when no tasks exist
 * - Lists all tasks in individual TaskCard components
 * 
 * @returns The complete tasks page with header and task list
 */
function TasksPageContent() {
  const { user, logout } = useAuth();
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuButtonRef, setMenuButtonRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);


  const handleLogout = () => {
    logout();
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  const handleOpenDeleteModal = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    // Delay clearing the deletingTask to allow modal exit animation to complete
    setTimeout(() => {
      setDeletingTask(null);
      setIsDeleting(false);
    }, 150); // Match the modal exit animation duration
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      await createTask(formData);
      handleCloseCreateModal();
    } catch (err) {
      throw err; // Re-throw for form error handling
    }
  };

  const handleEditTask = async (formData: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      await updateTask(editingTask.id, formData);
      handleCloseEditModal();
    } catch (err) {
      throw err; // Re-throw for form error handling
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    
    try {
      setIsDeleting(true);
      await deleteTask(deletingTask.id);
      handleCloseDeleteModal();
    } catch (err) {
      // Error handling is managed by TasksContext
      if (process.env.NODE_ENV === 'development') {
        console.error('Delete error:', err);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filterStatus === 'all') return true;
      return task.status === filterStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const renderMobileMenu = () => {
    if (!isMenuOpen || !menuButtonRef) return null;

    const rect = menuButtonRef.getBoundingClientRect();
    
    return createPortal(
      <>
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setIsMenuOpen(false)}
        />
        <div 
          className="fixed z-20 min-w-[160px] border rounded-lg shadow-lg overflow-hidden"
          style={{ 
            backgroundColor: 'var(--card)', 
            borderColor: 'var(--border)',
            top: rect.bottom + 8,
            right: window.innerWidth - rect.right,
          }}
        >
          <div className="p-2 space-y-2">
            <Button 
              variant="secondary" 
              size="md" 
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="w-full justify-start"
              style={{ width: '100%' }}
            >
              <svg 
                className="w-4 h-4 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
              Logout
            </Button>
            <div style={{ width: '100%' }}>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </>,
      document.body
    );
  };


  return (
    <PageLayout 
      title="Tasks" 
      description="Manage your tasks efficiently"
      userSection={
        <div className="flex items-center gap-3">
          {user && (
            <>
              <div className="text-right">
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Welcome back,</p>
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{user.username}</p>
              </div>
              
              {/* Desktop buttons */}
              <div className="hidden sm:flex items-center gap-3">
                <Button 
                  variant="secondary" 
                  size="md" 
                  onClick={handleLogout}
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                    />
                  </svg>
                  Logout
                </Button>
                <ThemeSwitcher />
              </div>

              {/* Mobile menu button */}
              <button
                ref={setMenuButtonRef}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg border transition-colors cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--secondary)', 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--secondary)';
                }}
                aria-label="Open menu"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </button>
            </>
          )}
        </div>
      }
    >
      {isLoading && (
        <LoadingSpinner message="Loading tasks..." />
      )}
      
      {error && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-4xl mb-4" style={{ color: 'var(--destructive)' }}>⚠️</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Error loading tasks</h3>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {tasks.length === 0 ? (
            <EmptyState 
              title="No tasks yet" 
              description="Create your first task to get started" 
            />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                      Filter:
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'completed')}
                      className="px-3 py-2 text-sm border rounded-md w-full sm:w-auto"
                      style={{
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)'
                      }}
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
                      Sort by Date:
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                      className="px-3 py-2 text-sm border rounded-md w-full sm:w-auto"
                      style={{
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)'
                      }}
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                  </div>
                </div>

                <Button onClick={handleOpenCreateModal}>
                  + Add Task
                </Button>
              </div>

              {filteredAndSortedTasks.length === 0 ? (
                <EmptyState 
                  title="No matching tasks" 
                  description="Try adjusting your filters to see more tasks" 
                />
              ) : (
                <div className="space-y-3">
                  {filteredAndSortedTasks.map((task) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title="Create New Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={handleCloseCreateModal}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleEditTask}
          onCancel={handleCloseEditModal}
          initialData={editingTask ? {
            title: editingTask.title,
            description: editingTask.description
          } : undefined}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={deletingTask ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        confirmVariant="danger-outline"
        isLoading={isDeleting}
      />

      {renderMobileMenu()}
    </PageLayout>
  );
}

/**
 * Protected wrapper for the tasks page
 * Handles authentication before rendering the page content
 */
export default function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksPageContent />
    </ProtectedRoute>
  );
}