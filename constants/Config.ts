// API Configuration
export const API_CONFIG = {
  // Base URL for the Rails backend
  BASE_URL: __DEV__ 
    ? 'http://localhost:3000' // Development - Rails server running locally
    : 'https://your-production-server.com', // Production URL (to be configured)
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
};

// Task priorities
export const TASK_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export type TaskPriority = typeof TASK_PRIORITIES[number];

// Task statuses matching backend API
export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = typeof TASK_STATUSES[number];

// Column display names
export const COLUMN_NAMES = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
} as const;

// Column colors for iOS design
export const COLUMN_COLORS = {
  todo: '#007AFF', // iOS Blue
  in_progress: '#FF9500', // iOS Orange
  done: '#34C759', // iOS Green
} as const;

// Priority colors for iOS design
export const PRIORITY_COLORS = {
  Critical: '#FF3B30', // iOS Red
  High: '#FF9500', // iOS Orange
  Medium: '#FFCC00', // iOS Yellow
  Low: '#34C759', // iOS Green
} as const;