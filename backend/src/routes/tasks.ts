import express from 'express';
import { tasks, getNextTaskId } from '@/data/tasks';
import { CreateTaskRequest } from '@/types/Task';

const router = express.Router();

/**
 * GET /api/tasks
 * Retrieve all tasks
 */
router.get('/', (req, res) => {
  try {
    res.json(tasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', (req, res) => {
  try {
    const { title, description, status = 'pending' }: CreateTaskRequest = req.body;

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required' 
      });
    }

    // Create new task
    const now = new Date().toISOString();
    const newTask = {
      id: getNextTaskId(),
      title,
      description,
      status,
      createdAt: now,
      updatedAt: now,
    };

    tasks.push(newTask);
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;