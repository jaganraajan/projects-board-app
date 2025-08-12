import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { TaskStatus } from '@/lib/api/client';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard() {
  const {
    tasks,
    isLoading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    clearError,
    user,
  } = useAuth();

  // Load tasks on component mount
  useEffect(() => {
    if (user) {
      loadTasks().catch(console.error);
    }
  }, [user]); // loadTasks is stable from auth context

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]); // clearError is stable from auth context

  const handleRefresh = async () => {
    try {
      await loadTasks();
    } catch {
      // Error handling is done in the auth context
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      await createTask(taskData);
    } catch (error) {
      // Error handling is done in the auth context
      throw error;
    }
  };

  const handleEditTask = async (taskId: string, updates: any) => {
    try {
      await updateTask(taskId, updates);
    } catch (error) {
      // Error handling is done in the auth context
      throw error;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      // Error handling is done in the auth context
      throw error;
    }
  };

  const handleMoveTask = async (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => {
    try {
      await moveTask(taskId, fromStatus, toStatus);
    } catch (error) {
      // Error handling is done in the auth context
      throw error;
    }
  };

  const totalTasks = tasks.todo.length + tasks.in_progress.length + tasks.done.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Projects Board</Text>
          {user && (
            <Text style={styles.headerSubtitle}>
              {user.company_name} • {totalTasks} task{totalTasks !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>

      {/* Kanban Board */}
      <ScrollView
        style={styles.boardContainer}
        contentContainerStyle={styles.boardContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
      >
        <KanbanColumn
          status="todo"
          tasks={tasks.todo}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          isLoading={isLoading}
        />
        
        <KanbanColumn
          status="in_progress"
          tasks={tasks.in_progress}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          isLoading={isLoading}
        />
        
        <KanbanColumn
          status="done"
          tasks={tasks.done}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
          isLoading={isLoading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  boardContainer: {
    flex: 1,
  },
  boardContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});