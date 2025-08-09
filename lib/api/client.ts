import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, TaskStatus, TaskPriority } from '@/constants/Config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS,
});

// Task interface matching backend API
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date?: string;
  priority?: TaskPriority;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}

// Request interfaces
export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus;
  due_date?: string;
  priority?: TaskPriority;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
  priority?: TaskPriority;
}

// Authentication interfaces
export interface AuthResponse {
  email: string;
  company_name: string;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  company_name: string;
}

// API Error class
export class APIError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

// Helper function to get auth headers
const getAuthHeaders = (token: string, email: string) => ({
  'Authorization': `Bearer ${token}`,
  'X-User-Email': email,
});

// Auth API functions
export const authAPI = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await api.post('/login', {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new APIError('Invalid email or password', 401);
      }
      throw new APIError(error.message || 'Login failed', error.response?.status || 500);
    }
  },

  async register(userData: RegisterRequest): Promise<boolean> {
    try {
      await api.post('/register', {
        user: userData,
      });
      return true;
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorMessage = error.response.data?.errors?.join(', ') || 'Registration failed';
        throw new APIError(errorMessage, 422);
      }
      throw new APIError(error.message || 'Registration failed', error.response?.status || 500);
    }
  },

  async getCurrentUser(token: string): Promise<{ email: string; company_name: string }> {
    try {
      const response = await api.get('/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(error.message || 'Failed to get user details', error.response?.status || 500);
    }
  },
};

// Tasks API functions
export const tasksAPI = {
  async fetchTasks(token: string, email: string): Promise<Task[]> {
    try {
      const response: AxiosResponse<Task[]> = await api.get('/tasks', {
        headers: getAuthHeaders(token, email),
        params: { email }, // Also include as query parameter for compatibility
      });
      return response.data;
    } catch (error: any) {
      throw new APIError(error.message || 'Failed to fetch tasks', error.response?.status || 500);
    }
  },

  async createTask(taskData: CreateTaskRequest, token: string, email: string): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await api.post('/tasks', {
        task: taskData,
      }, {
        headers: getAuthHeaders(token, email),
        params: { email }, // Also include as query parameter for compatibility
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorMessage = error.response.data?.errors?.join(', ') || 'Invalid task data';
        throw new APIError(errorMessage, 422);
      }
      throw new APIError(error.message || 'Failed to create task', error.response?.status || 500);
    }
  },

  async updateTask(taskId: string, updates: UpdateTaskRequest, token: string, email: string): Promise<Task> {
    try {
      const response: AxiosResponse<Task> = await api.patch(`/tasks/${taskId}`, {
        task: updates,
      }, {
        headers: getAuthHeaders(token, email),
        params: { email }, // Also include as query parameter for compatibility
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new APIError('Task not found', 404);
      }
      if (error.response?.status === 403) {
        throw new APIError('You can only access your own tasks', 403);
      }
      if (error.response?.status === 422) {
        const errorMessage = error.response.data?.errors?.join(', ') || 'Invalid task data';
        throw new APIError(errorMessage, 422);
      }
      throw new APIError(error.message || 'Failed to update task', error.response?.status || 500);
    }
  },

  async deleteTask(taskId: string, token: string, email: string): Promise<void> {
    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: getAuthHeaders(token, email),
        params: { email }, // Also include as query parameter for compatibility
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new APIError('Task not found', 404);
      }
      if (error.response?.status === 403) {
        throw new APIError('You can only access your own tasks', 403);
      }
      throw new APIError(error.message || 'Failed to delete task', error.response?.status || 500);
    }
  },
};

// Helper function to normalize task priority (for compatibility with different backend responses)
export const normalizeTaskPriority = (task: Task): Task => ({
  ...task,
  priority: task.priority || 'Medium',
});

// Export combined API
export const api_client = {
  auth: authAPI,
  tasks: tasksAPI,
};

// Export types from Config.ts for use in components
export { TaskStatus, TaskPriority, TASK_STATUSES, TASK_PRIORITIES } from '@/constants/Config';