"use client";

import { useEffect, useState } from "react";
import { Task } from "@task-manager/shared";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`);
        const data = await response.json();
        console.log('Fetched tasks:', data);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
      <div>
        <h2 className="text-xl mb-4">Tasks from API:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(tasks, null, 2)}
        </pre>
      </div>
    </div>
  );
}