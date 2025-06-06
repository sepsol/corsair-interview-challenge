"use client";

import { useState } from "react";
import { useTasks } from "@/contexts/TasksContext";
import { Task } from "@task-manager/shared";
import { useMultiModal } from "@/hooks/useModal";
import { filterAndSortTasks } from "@/utils/taskUtils";
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
import UserNavbar from "@/components/UserNavbar";


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
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks();
  const { modals } = useMultiModal(['create', 'edit', 'delete'] as const);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleOpenCreateModal = () => {
    modals.create.open();
  };

  const handleCloseCreateModal = () => {
    modals.create.close();
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    modals.edit.open();
  };

  const handleCloseEditModal = () => {
    modals.edit.close();
    setEditingTask(null);
  };

  const handleOpenDeleteModal = (task: Task) => {
    setDeletingTask(task);
    modals.delete.open();
  };

  const handleCloseDeleteModal = () => {
    modals.delete.close();
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

  const filteredAndSortedTasks = filterAndSortTasks(tasks, filterStatus, sortOrder);


  return (
    <PageLayout 
      title="Tasks" 
      description="Manage your tasks efficiently"
      userSection={<UserNavbar />}
    >
      {/* Top bar - always visible */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--foreground)' }}>
              Filter:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'completed')}
              disabled={isLoading}
              className="px-3 py-2 text-sm border rounded-md w-full sm:w-auto"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
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
              disabled={isLoading}
              className="px-3 py-2 text-sm border rounded-md w-full sm:w-auto"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        <Button 
          onClick={handleOpenCreateModal}
          disabled={isLoading}
        >
          + Add Task
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <LoadingSpinner message="Loading tasks..." />
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-4xl mb-4" style={{ color: 'var(--destructive)' }}>⚠️</div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Error loading tasks</h3>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{error}</p>
          </div>
        </div>
      )}

      {/* Tasks content */}
      {!isLoading && !error && (
        <>
          {tasks.length === 0 ? (
            <EmptyState 
              title="No tasks yet" 
              description="Create your first task to get started" 
            />
          ) : (
            <>
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
        isOpen={modals.create.isOpen}
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
        isOpen={modals.edit.isOpen}
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
        isOpen={modals.delete.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={deletingTask ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        confirmVariant="danger-outline"
        isLoading={isDeleting}
      />
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