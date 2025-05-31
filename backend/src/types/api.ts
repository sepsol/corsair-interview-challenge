import { Request } from 'express';

/**
 * Standard error response format for all API endpoints
 */
export interface ErrorResponse {
  error: string;
}

/**
 * Standard success response format with optional message
 */
export interface SuccessResponse {
  message: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extended Request interface that includes authenticated user information
 */
export interface AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
  Locals extends Record<string, any> = Record<string, any>
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: {
    id: string;
    username: string;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */