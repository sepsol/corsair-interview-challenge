import express from 'express';
import { tasks } from '@/data/tasks';

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

export default router;