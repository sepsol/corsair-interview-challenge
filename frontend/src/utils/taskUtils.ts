import { Task } from '@task-manager/shared';

/**
 * Task-related utility functions
 */

/**
 * Get the display properties for a task status
 * @param status - The task status
 * @returns Object with display text, color, and icon
 */
export function getStatusDisplay(status: 'pending' | 'completed') {
  switch (status) {
    case 'completed':
      return {
        text: 'Completed',
        color: '#22c55e',
        icon: '✓',
        className: 'completed'
      };
    case 'pending':
      return {
        text: 'Pending',
        color: '#eab308',
        icon: '',
        className: 'pending'
      };
    default:
      return {
        text: 'Unknown',
        color: '#6b7280',
        icon: '?',
        className: 'unknown'
      };
  }
}

/**
 * Filter tasks by status
 * @param tasks - Array of tasks to filter
 * @param status - Status to filter by ('all' includes all tasks)
 * @returns Filtered array of tasks
 */
export function filterTasksByStatus(
  tasks: Task[], 
  status: 'all' | 'pending' | 'completed'
): Task[] {
  if (status === 'all') {
    return tasks;
  }
  return tasks.filter(task => task.status === status);
}

/**
 * Sort tasks by creation date
 * @param tasks - Array of tasks to sort
 * @param order - Sort order ('asc' for oldest first, 'desc' for newest first)
 * @returns Sorted array of tasks
 */
export function sortTasksByDate(tasks: Task[], order: 'asc' | 'desc' = 'desc'): Task[] {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Filter and sort tasks in one operation
 * @param tasks - Array of tasks to process
 * @param status - Status filter
 * @param sortOrder - Sort order
 * @returns Filtered and sorted array of tasks
 */
export function filterAndSortTasks(
  tasks: Task[],
  status: 'all' | 'pending' | 'completed' = 'all',
  sortOrder: 'asc' | 'desc' = 'desc'
): Task[] {
  const filtered = filterTasksByStatus(tasks, status);
  return sortTasksByDate(filtered, sortOrder);
}

/**
 * Get task statistics
 * @param tasks - Array of tasks to analyze
 * @returns Object with task counts and percentages
 */
export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'completed').length;
  const pending = tasks.filter(task => task.status === 'pending').length;
  
  return {
    total,
    completed,
    pending,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}