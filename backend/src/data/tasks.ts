import { Task } from '@task-manager/shared';
import { readJSONFile, writeJSONFile, getStoragePath } from '@/utils/fileStorage';

/**
 * File path for tasks storage
 */
const TASKS_FILE = getStoragePath('tasks.json');

/**
 * Default tasks data
 */
const DEFAULT_TASKS: Task[] = [
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

/**
 * Read all tasks from file
 */
export const getAllTasks = async (): Promise<Task[]> => {
  return await readJSONFile(TASKS_FILE, DEFAULT_TASKS);
};

/**
 * Write all tasks to file
 */
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  await writeJSONFile(TASKS_FILE, tasks);
};

/**
 * Get a task by ID
 */
export const getTaskById = async (id: string): Promise<Task | undefined> => {
  const tasks = await getAllTasks();
  return tasks.find(task => task.id === id);
};

/**
 * Add a new task
 */
export const addTask = async (task: Task): Promise<Task> => {
  const tasks = await getAllTasks();
  tasks.push(task);
  await saveTasks(tasks);
  return task;
};

/**
 * Update an existing task
 */
export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  const tasks = await getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    id, // Preserve original ID
    updatedAt: new Date().toISOString(),
  };
  
  tasks[taskIndex] = updatedTask;
  await saveTasks(tasks);
  return updatedTask;
};

/**
 * Delete a task by ID
 */
export const deleteTask = async (id: string): Promise<Task | null> => {
  const tasks = await getAllTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return null;
  }
  
  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  await saveTasks(tasks);
  return deletedTask;
};

/**
 * Get tasks by user ID
 */
export const getTasksByUserId = async (userId: string): Promise<Task[]> => {
  const tasks = await getAllTasks();
  return tasks.filter(task => task.userId === userId);
};

/**
 * Simple ID counter for generating unique task IDs
 */
let nextTaskId = 1;
let isInitialized = false;

/**
 * Initialize the ID counter based on existing tasks
 */
const initializeIdCounter = async (): Promise<void> => {
  if (isInitialized) return;
  
  try {
    const tasks = await getAllTasks();
    if (tasks.length > 0) {
      // Find the highest existing ID and set next ID accordingly
      const maxId = Math.max(...tasks.map(task => parseInt(task.id, 10) || 0));
      nextTaskId = maxId + 1;
    }
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize ID counter:', error);
    // Fall back to default if there's an error
    nextTaskId = 1;
    isInitialized = true;
  }
};

/**
 * Get next task ID and increment counter
 */
export const getNextTaskId = async (): Promise<string> => {
  await initializeIdCounter();
  const id = nextTaskId.toString();
  nextTaskId++;
  return id;
};