export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: 'pending' | 'completed';
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
}