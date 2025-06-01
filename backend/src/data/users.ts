import bcrypt from 'bcryptjs';
import { User } from '@task-manager/shared';
import { readJSONFile, writeJSONFile, getStoragePath } from '@/utils/fileStorage';

// Internal user interface with password field for backend storage
export interface UserWithPassword extends User {
  password: string; // hashed
}

/**
 * File path for users storage
 */
const USERS_FILE = getStoragePath('users.json');

/**
 * Default users data with hashed password for 'password123'
 */
const DEFAULT_USERS: UserWithPassword[] = [
  {
    id: '1',
    username: 'defaultuser',
    password: '$2b$10$QnyG3udMiuNNz.mn99YSY.7KTsAfoaEn8.Y2Ku3tNfxMep180DRpi', // password123
    createdAt: new Date().toISOString()
  }
];

/**
 * Get all users from file storage
 * @returns Promise resolving to array of all users with passwords
 */
export const getAllUsers = async (): Promise<UserWithPassword[]> => {
  return await readJSONFile(USERS_FILE, DEFAULT_USERS);
};

/**
 * Write all users to file
 */
export const saveUsers = async (users: UserWithPassword[]): Promise<void> => {
  await writeJSONFile(USERS_FILE, users);
};

/**
 * Find a user by their ID
 * @param id - The user ID to search for
 * @returns Promise resolving to user with password if found, undefined otherwise
 */
export const getUserById = async (id: string): Promise<UserWithPassword | undefined> => {
  const users = await getAllUsers();
  return users.find(user => user.id === id);
};

/**
 * Find a user by their username
 * @param username - The username to search for
 * @returns Promise resolving to user with password if found, undefined otherwise
 */
export const getUserByUsername = async (username: string): Promise<UserWithPassword | undefined> => {
  const users = await getAllUsers();
  return users.find(user => user.username === username);
};

/**
 * Create a new user with hashed password
 * @param username - The username for the new user
 * @param password - The plain text password to hash
 * @returns Promise resolving to the created user with hashed password
 */
export const createUser = async (username: string, password: string): Promise<UserWithPassword> => {
  const users = await getAllUsers();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser: UserWithPassword = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  await saveUsers(users);
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