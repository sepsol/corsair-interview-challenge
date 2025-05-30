import { Task } from '@/types/Task';

/**
 * In-memory task storage
 */
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Sample Task',
    description: 'This is a sample task to get started',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

/**
 * Simple ID counter for generating unique task IDs
 */
export let nextTaskId = 2;