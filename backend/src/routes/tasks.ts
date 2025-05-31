/* eslint-disable @typescript-eslint/no-empty-object-type */
import express from 'express';
import { tasks, getNextTaskId } from '@/data/tasks';
import { CreateTaskRequest, Task } from '@/types/Task';
import { ErrorResponse } from '@/types/api';

const router = express.Router();

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
    const { title, description, status = 'pending' } = req.body;

    // Basic validation
    if (!title || !description) {
      res.status(400).json({ 
        error: 'Title and description are required' 
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

export default router;