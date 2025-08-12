import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskStatus } from '@/lib/api/client';
import { COLUMN_NAMES, COLUMN_COLORS } from '@/constants/Config';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (taskData: any) => Promise<void>;
  onEditTask: (taskId: string, updates: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onMoveTask: (taskId: string, fromStatus: TaskStatus, toStatus: TaskStatus) => Promise<void>;
  isLoading: boolean;
}

export default function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  isLoading,
}: KanbanColumnProps) {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const getColumnColor = () => COLUMN_COLORS[status as keyof typeof COLUMN_COLORS];
  const getColumnName = () => COLUMN_NAMES[status as keyof typeof COLUMN_NAMES];

  const handleMoveTask = (taskId: string, targetStatus: TaskStatus) => {
    if (targetStatus === status) return;
    onMoveTask(taskId, status, targetStatus);
  };

  const handleAddTask = async (taskData: any) => {
    try {
      await onAddTask({
        ...taskData,
        status,
      });
      setIsAddModalVisible(false);
    } catch (error) {
      console.error('Failed to add task:', error);
      Alert.alert('Error', 'Failed to add task. Please try again.');
    }
  };

  return (
    <>
      <View style={styles.row}>
        {/* Row Header */}
        <View style={[styles.header, { borderLeftColor: getColumnColor() }]}>
          <Text style={styles.headerTitle}>{getColumnName()}</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{tasks.length}</Text>
          </View>
        </View>

        {/* Tasks List - Horizontal ScrollView for mobile-friendly touch interaction */}
        {tasks.length > 0 && (
          <ScrollView 
            horizontal
            style={styles.tasksList}
            contentContainerStyle={styles.tasksContent}
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={260} // Width of task card + margin
            snapToAlignment="start"
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onMove={(taskId, targetStatus) => handleMoveTask(taskId, targetStatus as TaskStatus)}
                isLoading={isLoading}
              />
            ))}

            {/* Add Task Button */}
            <TouchableOpacity
              style={[styles.addButton, { borderColor: getColumnColor() }]}
              onPress={() => setIsAddModalVisible(true)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="add" 
                size={24} 
                color={getColumnColor()} 
                style={styles.addIcon}
              />
              <Text style={[styles.addButtonText, { color: getColumnColor() }]}>
                {isLoading ? 'Adding...' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Empty state for when no tasks */}
        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons 
              name="add-circle-outline" 
              size={32} 
              color="#9CA3AF" 
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>No tasks yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add one</Text>
            <TouchableOpacity
              style={[styles.addButton, { borderColor: getColumnColor() }]}
              onPress={() => setIsAddModalVisible(true)}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="add" 
                size={24} 
                color={getColumnColor()} 
                style={styles.addIcon}
              />
              <Text style={[styles.addButtonText, { color: getColumnColor() }]}>
                {isLoading ? 'Adding...' : 'Add Task'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <AddTaskModal
        visible={isAddModalVisible}
        onSave={handleAddTask}
        onCancel={() => setIsAddModalVisible(false)}
        isLoading={isLoading}
        columnName={getColumnName()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  headerBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 28,
    alignItems: 'center',
  },
  headerBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tasksList: {
    paddingVertical: 8,
  },
  tasksContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  addButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginLeft: 16,
    marginRight: 16,
    width: 220,
    borderWidth: 2,
    borderRadius: 16,
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    minHeight: 140,
  },
  addIcon: {
    marginBottom: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});