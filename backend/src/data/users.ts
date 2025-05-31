import bcrypt from 'bcryptjs';
import { User } from '@task-manager/shared';

// Internal user interface with password field for backend storage
export interface UserWithPassword extends User {
  password: string; // hashed
}

/**
 * In-memory user storage array
 */
const users: UserWithPassword[] = [];

/**
 * Initialize the user storage with a default admin user
 */
const initializeDefaultUser = async () => {
  if (users.length === 0) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    users.push({
      id: '1',
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date().toISOString()
    });
  }
};

// Initialize default user on module load
initializeDefaultUser();

/**
 * Get all users from memory storage
 * @returns Array of all users with passwords
 */
export const getAllUsers = (): UserWithPassword[] => {
  return users;
};

/**
 * Find a user by their ID
 * @param id - The user ID to search for
 * @returns User with password if found, undefined otherwise
 */
export const getUserById = (id: string): UserWithPassword | undefined => {
  return users.find(user => user.id === id);
};

/**
 * Find a user by their username
 * @param username - The username to search for
 * @returns User with password if found, undefined otherwise
 */
export const getUserByUsername = (username: string): UserWithPassword | undefined => {
  return users.find(user => user.username === username);
};

/**
 * Create a new user with hashed password
 * @param username - The username for the new user
 * @param password - The plain text password to hash
 * @returns Promise resolving to the created user with hashed password
 */
export const createUser = async (username: string, password: string): Promise<UserWithPassword> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: UserWithPassword = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  return newUser;
};

/**
 * Validate a plain text password against a hashed password
 * @param plainPassword - The plain text password to validate
 * @param hashedPassword - The hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export const validatePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};