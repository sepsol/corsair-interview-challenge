"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Task } from "@task-manager/shared";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageLayout from "@/components/ui/PageLayout";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TaskForm, { TaskFormData } from "@/components/TaskForm";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsSubmitting(false);
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    setIsSubmitting(true);
    
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
      handleCloseModal();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || err.message || 'Failed to create task';
        throw new Error(message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout 
      title="Tasks" 
      description="Manage your tasks efficiently"
      headerAction={
        <Button onClick={handleOpenModal}>
          + Add Task
        </Button>
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
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Task"
        size="md"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </PageLayout>
  );
}