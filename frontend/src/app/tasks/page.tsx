"use client";

import { useEffect, useState } from "react";
import { Task } from "@task-manager/shared";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PageLayout from "@/components/ui/PageLayout";
import TaskCard from "@/components/TaskCard";
import EmptyState from "@/components/ui/EmptyState";

/**
 * Main tasks page component that displays a list of tasks
 * 
 * Features:
 * - Fetches tasks from the API on component mount
 * - Displays loading state while fetching
 * - Shows error state if API request fails
 * - Renders empty state when no tasks exist
 * - Lists all tasks in individual TaskCard components
 * 
 * @returns The complete tasks page with header and task list
 */
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <PageLayout title="Tasks" description="Manage your tasks efficiently">
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
    </PageLayout>
  );
}