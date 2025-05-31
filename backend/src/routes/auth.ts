/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Router, Request, Response } from 'express';
import { LoginRequest, RegisterRequest, AuthResponse } from '@task-manager/shared';
import { getUserByUsername, createUser, validatePassword } from '@/data/users';
import { generateToken } from '@/middleware/auth';
import { ErrorResponse } from '@/types/api';

const router = Router();

/**
 * POST /api/auth/login
 * Authenticate user with username and password
 */
router.post('/login', async (req: Request<{}, unknown, LoginRequest>, res: Response<AuthResponse | ErrorResponse>) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ 
        error: 'Username and password are required' 
      });
      return;
    }

    const user = getUserByUsername(username);
    if (!user) {
      res.status(401).json({ 
        error: 'Invalid credentials' 
      });
      return;
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ 
        error: 'Invalid credentials' 
      });
      return;
    }

    const token = generateToken(user.id);
    
    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      }
    };

    res.json(response);
  } catch (error: unknown) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register', async (req: Request<{}, unknown, RegisterRequest>, res: Response<AuthResponse | ErrorResponse>) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ 
        error: 'Username and password are required' 
      });
      return;
    }

    if (username.length < 3) {
      res.status(400).json({ 
        error: 'Username must be at least 3 characters long' 
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
      return;
    }

    const existingUser = getUserByUsername(username);
    if (existingUser) {
      res.status(409).json({ 
        error: 'Username already exists' 
      });
      return;
    }

    const newUser = await createUser(username, password);
    const token = generateToken(newUser.id);
    
    const response: AuthResponse = {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        createdAt: newUser.createdAt
      }
    };

    res.status(201).json(response);
  } catch (error: unknown) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;