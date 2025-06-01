"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Task } from '@task-manager/shared';
import { TaskFormData } from '@/schemas/taskSchema';
import api from '@/services/api';

interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  toggleLoadingTasks: Set<string>;
  createTask: (formData: TaskFormData) => Promise<void>;
  updateTask: (taskId: string, formData: TaskFormData) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskStatus: (task: Task) => Promise<void>;
  fetchTasks: () => Promise<void>;
  clearError: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

interface TasksProviderProps {
  children: ReactNode;
}

export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toggleLoadingTasks, setToggleLoadingTasks] = useState<Set<string>>(new Set());
  const router = useRouter();

  const clearError = () => {
    setError(null);
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<Task[]>('/tasks');
      setTasks(response.data);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Check if it's an authentication error
        if (err.response?.status === 401 || err.response?.status === 403) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Authentication expired, redirecting to root');
          }
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          router.push('/');
          return;
        }
        
        // Handle other API errors
        const message = err.response?.data?.error || err.message || 'Failed to fetch tasks';
        setError(message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (formData: TaskFormData) => {
    const response = await api.post<Task>('/tasks', {
      title: formData.title,
      description: formData.description || '',
      status: 'pending'
    });

    // Add new task to the list (prepend to show it at the top)
    setTasks(prev => [response.data, ...prev]);
  };

  const updateTask = async (taskId: string, formData: TaskFormData) => {
    const response = await api.put<Task>(`/tasks/${taskId}`, {
      title: formData.title,
      description: formData.description || '',
    });

    // Update the task in the list
    setTasks(prev => prev.map(task => 
      task.id === taskId ? response.data : task
    ));
  };

  const deleteTask = async (taskId: string) => {
    await api.delete(`/tasks/${taskId}`);

    // Remove task from the list
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = async (task: Task) => {
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
      
      // Set error state
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('Status toggle error:', errorMessage);
      }
      
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

  // Initial fetch on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const value = {
    tasks,
    isLoading,
    error,
    toggleLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    fetchTasks,
    clearError,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}