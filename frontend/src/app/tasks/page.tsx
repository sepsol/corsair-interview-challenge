"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Task, User } from "@task-manager/shared";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageLayout from "@/components/ui/PageLayout";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import TaskForm from "@/components/TaskForm";
import { TaskFormData } from "@/schemas/taskSchema";
import api from "@/services/api";

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
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toggleLoadingTasks, setToggleLoadingTasks] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Task[]>('/tasks');
        setTasks(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          // Handle Axios-specific errors
          const message = err.response?.data?.error || err.message || 'Failed to fetch tasks';
          setError(message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    // Clear user state
    setUser(null);
    
    console.log('User logged out');
    
    // Redirect to login page
    router.push('/login');
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
      // Create task via API
      const response = await api.post<Task>('/tasks', {
        title: formData.title,
        description: formData.description || '',
        status: 'pending'
      });

      // Add new task to the list (prepend to show it at the top)
      setTasks(prev => [response.data, ...prev]);
      
      // Close modal
      handleCloseCreateModal();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || err.message || 'Failed to create task';
        throw new Error(message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };

  const handleEditTask = async (formData: TaskFormData) => {
    if (!editingTask) return;
    
    try {
      // Update task via API
      const response = await api.put<Task>(`/tasks/${editingTask.id}`, {
        title: formData.title,
        description: formData.description || '',
      });

      // Update the task in the list
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? response.data : task
      ));
      
      // Close modal
      handleCloseEditModal();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || err.message || 'Failed to update task';
        throw new Error(message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) return;
    
    try {
      setIsDeleting(true);
      
      // Delete task via API
      await api.delete(`/tasks/${deletingTask.id}`);

      // Remove task from the list
      setTasks(prev => prev.filter(task => task.id !== deletingTask.id));
      
      // Close modal
      handleCloseDeleteModal();
    } catch (err) {
      let errorMessage = 'Failed to delete task';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      }
      
      // Set error state for user feedback
      setError(errorMessage);
      console.error('Delete error:', errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    // Add task to loading set
    setToggleLoadingTasks(prev => new Set(prev).add(task.id));
    
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      
      // Update task status via API
      const response = await api.put<Task>(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: newStatus
      });

      // Update the task in the list
      setTasks(prev => prev.map(t => 
        t.id === task.id ? response.data : t
      ));
    } catch (err) {
      let errorMessage = 'Failed to update task status';
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      }
      
      // Set error state (you could implement a toast/notification system here)
      setError(errorMessage);
      console.error('Status toggle error:', errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      // Remove task from loading set
      setToggleLoadingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(task.id);
        return newSet;
      });
    }
  };

  return (
    <PageLayout 
      title="Tasks" 
      description="Manage your tasks efficiently"
      userSection={
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-right">
              <p className="text-sm text-neutral-300">Welcome back,</p>
              <p className="text-sm font-medium text-neutral-100">{user.username}</p>
            </div>
          )}
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
          <Button onClick={handleOpenCreateModal}>
            + Add Task
          </Button>
        </div>
      }
    >
      {isLoading && (
        <LoadingSpinner message="Loading tasks..." />
      )}
      
      {error && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-neutral-100 mb-2">Error loading tasks</h3>
            <p className="text-neutral-500 text-sm">{error}</p>
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
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                  onToggleStatus={handleToggleTaskStatus}
                  isToggleLoading={toggleLoadingTasks.has(task.id)}
                />
              ))}
            </div>
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
    </PageLayout>
  );
}