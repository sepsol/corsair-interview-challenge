import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '@/data/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Extended Request interface that includes authenticated user information
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

/**
 * Middleware to authenticate JWT tokens from Authorization header
 * @param req - Express request object with potential user context
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = getUserById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid token - user not found' });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username
    };
    
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

/**
 * Generate a JWT token for a user
 * @param userId - The user ID to include in the token payload
 * @returns JWT token string with 24-hour expiration
 */
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
};