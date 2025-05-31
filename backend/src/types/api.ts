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