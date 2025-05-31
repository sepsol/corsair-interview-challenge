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
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    setFormData({ title: '', description: '' });
    setSubmitError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', description: '' });
    setSubmitError(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      setSubmitError('Title is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Create task via API
      const response = await api.post<Task>('/tasks', {
        title: formData.title.trim(),
        description: formData.description.trim() || '',
        status: 'pending'
      });

      // Add new task to the list (prepend to show it at the top)
      setTasks(prev => [response.data, ...prev]);
      
      // Close modal and reset form
      handleCloseModal();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.error || err.message || 'Failed to create task';
        setSubmitError(message);
      } else {
        setSubmitError('An unexpected error occurred');
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
        <div className="space-y-4">
          {/* Error Message */}
          {submitError && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-md p-3">
              <p className="text-red-300 text-sm">{submitError}</p>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              disabled={isSubmitting}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-neutral-200 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isSubmitting}
              rows={3}
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-transparent resize-vertical disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter task description (optional)..."
            />
          </div>

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
              onClick={handleCloseModal}
              variant="secondary"
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}