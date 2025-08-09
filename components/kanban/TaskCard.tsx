import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority } from '@/lib/api/client';
import { PRIORITY_COLORS } from '@/constants/Config';
import TaskEditModal from './TaskEditModal';

interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string, updates: any) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onMove: (taskId: string, currentStatus: string) => void;
  isLoading: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 3 - 10; // Account for padding and gaps

export default function TaskCard({ task, onEdit, onDelete, onMove, isLoading }: TaskCardProps) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const getPriorityColor = (priority: TaskPriority) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.Medium;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => onDelete(task.id) 
        },
      ]
    );
  };

  const handleMove = () => {
    const moveOptions: {
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }[] = [
      { text: 'Cancel', style: 'cancel' },
    ];

    if (task.status !== 'todo') {
      moveOptions.push({
        text: 'Move to To Do',
        onPress: () => onMove(task.id, 'todo'),
      });
    }
    
    if (task.status !== 'in_progress') {
      moveOptions.push({
        text: 'Move to In Progress',
        onPress: () => onMove(task.id, 'in_progress'),
      });
    }
    
    if (task.status !== 'done') {
      moveOptions.push({
        text: 'Move to Done',
        onPress: () => onMove(task.id, 'done'),
      });
    }

    Alert.alert('Move Task', 'Where would you like to move this task?', moveOptions);
  };

  const handleSaveEdit = async (updates: any) => {
    try {
      await onEdit(task.id, updates);
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('Failed to save task updates:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={handleMove}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        {/* Priority indicator */}
        <View 
          style={[
            styles.priorityIndicator, 
            { backgroundColor: getPriorityColor(task.priority || 'Medium') }
          ]} 
        />

        {/* Card header with actions */}
        <View style={styles.cardHeader}>
          <TouchableOpacity
            onPress={() => setIsEditModalVisible(true)}
            disabled={isLoading}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="pencil" size={16} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isLoading}
            style={styles.actionButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Task content */}
        <View style={styles.cardContent}>
          <Text style={styles.taskTitle} numberOfLines={2}>
            {task.title}
          </Text>
          <Text style={styles.taskDescription} numberOfLines={3}>
            {task.description}
          </Text>
        </View>

        {/* Card footer */}
        <View style={styles.cardFooter}>
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityText}>
              {task.priority || 'Medium'}
            </Text>
          </View>
          
          {task.due_date && (
            <Text style={styles.dueDateText}>
              {formatDate(task.due_date)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <TaskEditModal
        visible={isEditModalVisible}
        task={task}
        onSave={handleSaveEdit}
        onCancel={() => setIsEditModalVisible(false)}
        isLoading={isLoading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  priorityIndicator: {
    height: 4,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 18,
  },
  taskDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  priorityBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
  },
  dueDateText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
});