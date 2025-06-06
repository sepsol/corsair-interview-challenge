import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '@/data/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Middleware to authenticate JWT tokens from Authorization header
 * @param req - Express request object without user context
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid or expired session' });
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