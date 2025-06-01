/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router, Request, Response } from 'express';
import { getTasksByUserId, addTask, updateTask, deleteTask, getNextTaskId } from '@/data/tasks';
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
router.get('/', async (req: Request, res: Response<Task[] | ErrorResponse>) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }
    
    // Get tasks by user ID from file storage
    const userTasks = await getTasksByUserId(userId);
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
router.post('/', async (req: Request<{}, unknown, CreateTaskRequest>, res: Response<Task | ErrorResponse>) => {
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
      id: await getNextTaskId(),
      userId,
      title,
      description,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const savedTask = await addTask(newTask);
    
    res.status(201).json(savedTask);
  } catch (error: unknown) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/tasks/:id
 * Update an existing task (only if owned by authenticated user)
 */
router.put('/:id', async (req: Request<{ id: string }, unknown, UpdateTaskRequest>, res: Response<Task | ErrorResponse>) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user?.id;

    // Check authentication
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get user's tasks to verify ownership
    const userTasks = await getTasksByUserId(userId);
    const existingTask = userTasks.find(task => task.id === id);
    
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Update task with provided fields
    const updates: Partial<Task> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    const updatedTask = await updateTask(id, updates);
    
    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
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
router.delete('/:id', async (req: Request<{ id: string }>, res: Response<Task | ErrorResponse>) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check authentication
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    // Get user's tasks to verify ownership
    const userTasks = await getTasksByUserId(userId);
    const existingTask = userTasks.find(task => task.id === id);
    
    if (!existingTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Delete the task
    const deletedTask = await deleteTask(id);
    
    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    res.status(200).json(deletedTask);
  } catch (error: unknown) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;