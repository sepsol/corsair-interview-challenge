import { Task } from '@task-manager/shared';

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
let nextTaskId = 2;

/**
 * Get next task ID and increment counter
 */
export const getNextTaskId = (): string => {
  const id = nextTaskId.toString();
  nextTaskId++;
  return id;
};