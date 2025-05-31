"use client";

import { useEffect, useState } from "react";
import { Task } from "@task-manager/shared";

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
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-800 border-t-neutral-500 mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-neutral-100 mb-2">Error loading tasks</h2>
          <p className="text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-700/50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-100">Tasks</h1>
              <p className="text-neutral-500 mt-1">Manage your tasks efficiently</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-neutral-100 mb-2">No tasks yet</h3>
            <p className="text-neutral-500 mb-6">Create your first task to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className="bg-neutral-900 border border-neutral-700/60 rounded-md p-5 hover:bg-neutral-800/80 hover:border-neutral-600/70 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-neutral-100 mb-2">{task.title}</h3>
                    <p className="text-neutral-400 text-sm mb-3 leading-relaxed">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-600">
                      <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                      {task.status === 'completed' && (
                        <span className="text-green-400/60 font-medium">✓ Completed</span>
                      )}
                      {task.status === 'pending' && (
                        <span className="text-amber-400/65 font-medium">⏳ Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}