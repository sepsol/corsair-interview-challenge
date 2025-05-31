import { Request, Response, NextFunction } from 'express';

/**
 * Simple artificial delay middleware for development testing
 * 
 * @param delayMs - Delay in milliseconds
 * @returns Express middleware function
 */
export function artificialDelay(delayMs: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only apply delay in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏳ Delaying ${req.method} ${req.path} by ${delayMs}ms`);
      setTimeout(() => {
        next();
      }, delayMs);
    } else {
      next();
    }
  };
}

export default artificialDelay;