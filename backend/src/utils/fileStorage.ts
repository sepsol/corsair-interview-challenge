import { promises as fs } from 'fs';
import path from 'path';

/**
 * Generic async JSON file storage utilities
 * Provides atomic writes and error handling for data persistence
 */

/**
 * Read a JSON file and parse its contents
 * @param filePath - Path to the JSON file
 * @param defaultValue - Default value to return and create if file doesn't exist
 * @returns Parsed JSON data or default value
 */
export async function readJSONFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    // If file doesn't exist, create it with default value
    if (error.code === 'ENOENT') {
      await ensureDirectoryExists(path.dirname(filePath));
      await writeJSONFile(filePath, defaultValue);
      return defaultValue;
    }
    
    // If JSON is corrupted, log error and return default
    if (error instanceof SyntaxError) {
      console.error(`Corrupted JSON file ${filePath}:`, error.message);
      await createBackup(filePath);
      await writeJSONFile(filePath, defaultValue);
      return defaultValue;
    }
    
    // Re-throw other errors
    throw new Error(`Failed to read JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * Write data to a JSON file atomically (using temp file + rename)
 * @param filePath - Path to the JSON file
 * @param data - Data to write
 */
export async function writeJSONFile<T>(filePath: string, data: T): Promise<void> {
  const tempFile = filePath + '.tmp';
  
  try {
    // Ensure directory exists
    await ensureDirectoryExists(path.dirname(filePath));
    
    // Write to temp file first
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf8');
    
    // Atomic rename (this is atomic on most filesystems)
    await fs.rename(tempFile, filePath);
  } catch (error: any) {
    // Clean up temp file if write failed
    try {
      await fs.unlink(tempFile);
    } catch {
      // Ignore cleanup errors
    }
    
    throw new Error(`Failed to write JSON file ${filePath}: ${error.message}`);
  }
}

/**
 * Ensure a directory exists, creating it recursively if needed
 * @param dirPath - Directory path to ensure exists
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
    }
  }
}

/**
 * Create a backup of a corrupted file
 * @param filePath - Path to the file to backup
 */
async function createBackup(filePath: string): Promise<void> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    await fs.copyFile(filePath, backupPath);
    console.log(`Created backup of corrupted file: ${backupPath}`);
  } catch (error) {
    console.error(`Failed to create backup for ${filePath}:`, error);
  }
}

/**
 * Get the absolute path to a storage file
 * @param fileName - Name of the storage file (e.g., 'tasks.json')
 * @returns Absolute path to the storage file
 */
export function getStoragePath(fileName: string): string {
  const storageDir = process.env.STORAGE_PATH || 'src/data/storage';
  return path.join(process.cwd(), storageDir, fileName);
}