import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
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

const { width } = Dimensions.get('window');
const columnWidth = (width - 60) / 3; // Account for padding and gaps

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
      <View style={[styles.column, { width: columnWidth }]}>
        {/* Column Header */}
        <View style={[styles.header, { borderTopColor: getColumnColor() }]}>
          <Text style={styles.headerTitle}>{getColumnName()}</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{tasks.length}</Text>
          </View>
        </View>

        {/* Tasks List */}
        <ScrollView 
          style={styles.tasksList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tasksContent}
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

          {/* Empty state */}
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
            </View>
          )}
        </ScrollView>

        {/* Add Task Button */}
        <TouchableOpacity
          style={[styles.addButton, { borderColor: getColumnColor() }]}
          onPress={() => setIsAddModalVisible(true)}
          disabled={isLoading}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="add" 
            size={20} 
            color={getColumnColor()} 
            style={styles.addIcon}
          />
          <Text style={[styles.addButtonText, { color: getColumnColor() }]}>
            {isLoading ? 'Adding...' : 'Add Task'}
          </Text>
        </TouchableOpacity>
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
  column: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    marginHorizontal: 4,
    flex: 1,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 4,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFFFFF',
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
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  headerBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  tasksContent: {
    paddingVertical: 8,
    paddingBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    borderWidth: 1.5,
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
  },
  addIcon: {
    marginRight: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});