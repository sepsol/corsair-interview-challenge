 
/* eslint-disable @typescript-eslint/no-empty-object-type */
import express from 'express';
import { tasks, getNextTaskId } from '@/data/tasks';
import { CreateTaskRequest, Task, UpdateTaskRequest } from '@task-manager/shared';
import { ErrorResponse } from '@/types/api';
import { authenticateToken } from '@/middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

/**
 * GET /api/tasks
 * Retrieve all tasks
 */
router.get<{}, Task[] | ErrorResponse>('/', (req, res) => {
  try {
    res.json(tasks);
  } catch (error: unknown) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post<{}, Task | ErrorResponse, CreateTaskRequest>('/', (req, res) => {
  try {
    const { title, description = '', status = 'pending' } = req.body;

    // Basic validation
    if (!title) {
      res.status(400).json({ 
        error: 'Title is required' 
      });
      return;
    }

    // Create new task
    const now = new Date().toISOString();
    const newTask: Task = {
      id: getNextTaskId(),
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
 * Update an existing task
 */
router.put<{ id: string }, Task | ErrorResponse, UpdateTaskRequest>('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Find task by ID
    const taskIndex = tasks.findIndex(task => task.id === id);
    
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
 * Delete a task
 */
router.delete<{ id: string }, Task | ErrorResponse>('/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Find task by ID
    const taskIndex = tasks.findIndex(task => task.id === id);
    
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