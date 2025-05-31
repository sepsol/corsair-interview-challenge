/**
 * Represents a user in the task manager system
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Username for authentication */
  username: string;
  /** ISO string timestamp when user was created */
  createdAt: string;
}

/**
 * Request payload for user login
 */
export interface LoginRequest {
  /** Username for authentication */
  username: string;
  /** User password */
  password: string;
}

/**
 * Request payload for user registration
 */
export interface RegisterRequest {
  /** Username for the new user */
  username: string;
  /** Password for the new user */
  password: string;
}

/**
 * Response payload for successful authentication
 */
export interface AuthResponse {
  /** JWT token for authenticated requests */
  token: string;
  /** User information (without password) */
  user: User;
}