/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router, Request, Response } from 'express';
import { tasks, getNextTaskId } from '@/data/tasks';
import { CreateTaskRequest, Task, UpdateTaskRequest } from '@task-manager/shared';
import { ErrorResponse } from '@/types/api';
import { authenticateToken } from '@/middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * GET /api/tasks
 * Retrieve all tasks for the authenticated user
 */
router.get('/', (req: Request, res: Response<Task[] | ErrorResponse>) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // Filter tasks by user ID
    const userTasks = tasks.filter(task => task.userId === userId);
    res.json(userTasks);
  } catch (error: unknown) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/tasks
 * Create a new task for the authenticated user
 */
router.post('/', (req: Request<{}, unknown, CreateTaskRequest>, res: Response<Task | ErrorResponse>) => {
  try {
    const { title, description = '', status = 'pending' } = req.body;
    const userId = req.user?.id;

    // Check authentication
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Basic validation
    if (!title) {
      res.status(400).json({ 
        error: 'Title is required' 
      });
      return;
    }

    // Create new task associated with the user
    const now = new Date().toISOString();
    const newTask: Task = {
      id: getNextTaskId(),
      userId,
      title,
      description,
      status,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    
    res.status(201).json(newTask);
  } catch (error: unknown) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task (only if owned by authenticated user)
 */
router.put('/:id', (req: Request<{ id: string }, unknown, UpdateTaskRequest>, res: Response<Task | ErrorResponse>) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user?.id;

    // Check authentication
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Find task by ID and ensure it belongs to the user
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);
    
    if (taskIndex === -1) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Update task with provided fields
    const existingTask = tasks[taskIndex];
    const updatedTask: Task = {
      ...existingTask,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;
    
    res.json(updatedTask);
  } catch (error: unknown) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task (only if owned by authenticated user)
 */
router.delete('/:id', (req: Request<{ id: string }>, res: Response<Task | ErrorResponse>) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check authentication
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Find task by ID and ensure it belongs to the user
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);
    
    if (taskIndex === -1) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Get the task before removing it
    const deletedTask = tasks[taskIndex];
    
    // Remove task from array
    tasks.splice(taskIndex, 1);
    
    res.status(200).json(deletedTask);
  } catch (error: unknown) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;