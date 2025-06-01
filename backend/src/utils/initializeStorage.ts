import { getAllTasks } from '@/data/tasks';
import { getAllUsers } from '@/data/users';
import { readJSONFile, writeJSONFile, getStoragePath } from '@/utils/fileStorage';
import { Task } from '@task-manager/shared';
import { UserWithPassword } from '@/data/users';

/**
 * Initialize storage with default data if files are empty or missing
 */
export async function initializeStorage(): Promise<void> {
  console.log('🔧 Initializing storage...');
  
  try {
    // Initialize users if empty
    await initializeUsers();
    
    // Initialize tasks if empty  
    await initializeTasks();
    
    console.log('✅ Storage initialization completed');
  } catch (error) {
    console.error('❌ Storage initialization failed:', error);
    throw error;
  }
}

/**
 * Initialize users storage with default user if empty
 */
async function initializeUsers(): Promise<void> {
  try {
    const users = await getAllUsers();
    
    if (users.length === 0) {
      console.log('📄 Creating default user...');
      
      const defaultUsers: UserWithPassword[] = [
        {
          id: '1',
          username: 'defaultuser',
          password: '$2b$10$QnyG3udMiuNNz.mn99YSY.7KTsAfoaEn8.Y2Ku3tNfxMep180DRpi', // password123
          createdAt: new Date().toISOString()
        }
      ];
      
      await writeJSONFile(getStoragePath('users.json'), defaultUsers);
      console.log('✅ Default user created: defaultuser / password123');
    } else {
      console.log(`📊 Found ${users.length} existing users`);
    }
  } catch (error) {
    console.error('Failed to initialize users:', error);
    throw error;
  }
}

/**
 * Initialize tasks storage with default task if empty
 */
async function initializeTasks(): Promise<void> {
  try {
    const tasks = await getAllTasks();
    
    if (tasks.length === 0) {
      console.log('📄 Creating default task...');
      
      const defaultTasks: Task[] = [
        {
          id: '1',
          userId: '1',
          title: 'Sample Task',
          description: 'This is a sample task to get started',
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      
      await writeJSONFile(getStoragePath('tasks.json'), defaultTasks);
      console.log('✅ Default task created');
    } else {
      console.log(`📊 Found ${tasks.length} existing tasks`);
    }
  } catch (error) {
    console.error('Failed to initialize tasks:', error);
    throw error;
  }
}