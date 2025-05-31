"use client";

import { useEffect, useState } from "react";
import { Task } from "@task-manager/shared";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import PageLayout from "@/components/ui/PageLayout";
import TaskCard from "@/components/TaskCard";

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

  if (isLoading) {
    return <LoadingSpinner message="Loading tasks..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <PageLayout title="Tasks" description="Manage your tasks efficiently">
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
    </PageLayout>
  );
}