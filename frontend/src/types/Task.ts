/**
 * Represents a task in the task manager system
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Task title */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Current status of the task */
  status: 'pending' | 'completed';
  /** ISO string timestamp when task was created */
  createdAt: string;
  /** ISO string timestamp when task was last updated */
  updatedAt: string;
}

/**
 * Request payload for creating a new task
 */
export interface CreateTaskRequest {
  /** Task title */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Initial task status (defaults to 'pending' if not provided) */
  status?: 'pending' | 'completed';
}

/**
 * Request payload for updating an existing task
 */
export interface UpdateTaskRequest {
  /** Updated task title */
  title?: string;
  /** Updated task description */
  description?: string;
  /** Updated task status */
  status?: 'pending' | 'completed';
}