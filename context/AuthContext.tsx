import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Task, 
  TaskStatus, 
  TaskPriority, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  AuthResponse,
  RegisterRequest,
  api_client,
  normalizeTaskPriority,
  APIError
} from '@/lib/api/client';

// Storage keys
const STORAGE_KEYS = {
  TOKEN: '@projects_board_token',
  USER: '@projects_board_user',
};

// Context type definition
type AuthContextType = {
  // Auth state
  user: { email: string; company_name: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Tasks state
  tasks: {
    todo: Task[];
    in_progress: Task[];
    done: Task[];
  };

  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;

  // Task actions
  loadTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskRequest) => Promise<void>;
  updateTask: (taskId: string, updates: UpdateTaskRequest) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => Promise<void>;

  // UI helpers
  clearError: () => void;
  setTasks: React.Dispatch<React.SetStateAction<{
    todo: Task[];
    in_progress: Task[];
    done: Task[];
  }>>;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [user, setUser] = useState<{ email: string; company_name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Tasks state
  const [tasks, setTasks] = useState({
    todo: [] as Task[],
    in_progress: [] as Task[],
    done: [] as Task[],
  });

  // Computed state
  const isAuthenticated = !!(user && token);

  // Initialize app - check for stored credentials
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
      ]);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Verify token is still valid by fetching user details
        try {
          const currentUser = await api_client.auth.getCurrentUser(storedToken);
          setToken(storedToken);
          setUser(currentUser);
          
          // Load tasks after successful auth verification
          await loadTasksInternal(storedToken, currentUser.email);
        } catch (authError) {
          // Token is invalid, clear stored data
          console.warn('Stored token is invalid, clearing auth data');
          await clearStoredAuth();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      setError('Failed to initialize app');
      await clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearStoredAuth = async () => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
    ]);
    setToken(null);
    setUser(null);
    setTasks({ todo: [], in_progress: [], done: [] });
  };

  // Auth actions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const authData = await api_client.auth.login(email, password);
      
      // Store credentials
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, authData.token),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
          email: authData.email,
          company_name: authData.company_name,
        })),
      ]);

      setToken(authData.token);
      setUser({
        email: authData.email,
        company_name: authData.company_name,
      });

      // Load tasks after successful login
      await loadTasksInternal(authData.token, authData.email);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof APIError) {
        setError(error.message);
      } else {
        setError('Login failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      await api_client.auth.register(userData);
      
      // After successful registration, attempt to login
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration failed:', error);
      if (error instanceof APIError) {
        setError(error.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await clearStoredAuth();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Task actions
  const loadTasksInternal = async (userToken: string, userEmail: string) => {
    try {
      const allTasks = await api_client.tasks.fetchTasks(userToken, userEmail);
      
      // Group tasks by status and normalize priorities
      const groupedTasks = {
        todo: allTasks.filter(task => task.status === 'todo').map(normalizeTaskPriority),
        in_progress: allTasks.filter(task => task.status === 'in_progress').map(normalizeTaskPriority),
        done: allTasks.filter(task => task.status === 'done').map(normalizeTaskPriority),
      };
      
      setTasks(groupedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      if (error instanceof APIError) {
        setError(`Failed to load tasks: ${error.message}`);
      } else {
        setError('Failed to load tasks. Please try again.');
      }
      
      // Fallback to empty tasks on error
      setTasks({ todo: [], in_progress: [], done: [] });
      throw error;
    }
  };

  const loadTasks = async (): Promise<void> => {
    if (!token || !user) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await loadTasksInternal(token, user.email);
    } catch (error) {
      // Error handling is done in loadTasksInternal
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (taskData: CreateTaskRequest): Promise<void> => {
    if (!token || !user) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const newTask = await api_client.tasks.createTask(taskData, token, user.email);
      const normalizedTask = normalizeTaskPriority(newTask);

      // Update local state
      setTasks(prev => ({
        ...prev,
        [taskData.status]: [...prev[taskData.status], normalizedTask],
      }));
    } catch (error) {
      console.error('Failed to create task:', error);
      if (error instanceof APIError) {
        setError(`Failed to create task: ${error.message}`);
      } else {
        setError('Failed to create task. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: UpdateTaskRequest): Promise<void> => {
    if (!token || !user) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const updatedTask = await api_client.tasks.updateTask(taskId, updates, token, user.email);
      const normalizedTask = normalizeTaskPriority(updatedTask);

      // Update local state
      setTasks(prev => {
        const newTasks = { ...prev };
        
        // Find the task in all columns and update it
        Object.keys(newTasks).forEach(column => {
          const columnKey = column as keyof typeof newTasks;
          const taskIndex = newTasks[columnKey].findIndex(task => task.id === taskId);
          if (taskIndex !== -1) {
            newTasks[columnKey][taskIndex] = normalizedTask;
          }
        });

        return newTasks;
      });
    } catch (error) {
      console.error('Failed to update task:', error);
      if (error instanceof APIError) {
        setError(`Failed to update task: ${error.message}`);
      } else {
        setError('Failed to update task. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    if (!token || !user) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await api_client.tasks.deleteTask(taskId, token, user.email);

      // Update local state
      setTasks(prev => {
        const newTasks = { ...prev };
        
        // Find the task in all columns and remove it
        Object.keys(newTasks).forEach(column => {
          const columnKey = column as keyof typeof newTasks;
          newTasks[columnKey] = newTasks[columnKey].filter(task => task.id !== taskId);
        });

        return newTasks;
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      if (error instanceof APIError) {
        setError(`Failed to delete task: ${error.message}`);
      } else {
        setError('Failed to delete task. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const moveTask = async (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus): Promise<void> => {
    if (fromStatus === toStatus) return;

    if (!token || !user) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Update task status via API
      await api_client.tasks.updateTask(taskId, { status: toStatus }, token, user.email);

      // Update local state
      setTasks(prev => {
        const sourceTasks = [...prev[fromStatus as keyof typeof prev]];
        const targetTasks = [...prev[toStatus as keyof typeof prev]];

        const taskIndex = sourceTasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return prev;

        const [movedTask] = sourceTasks.splice(taskIndex, 1);
        movedTask.status = toStatus;
        targetTasks.push(movedTask);

        return {
          ...prev,
          [fromStatus]: sourceTasks,
          [toStatus]: targetTasks,
        };
      });
    } catch (error) {
      console.error('Failed to move task:', error);
      if (error instanceof APIError) {
        setError(`Failed to move task: ${error.message}`);
      } else {
        setError('Failed to move task. Please try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // UI helpers
  const clearError = () => setError(null);

  const contextValue: AuthContextType = {
    // Auth state
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Tasks state
    tasks,

    // Auth actions
    login,
    register,
    logout,

    // Task actions
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,

    // UI helpers
    clearError,
    setTasks,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}