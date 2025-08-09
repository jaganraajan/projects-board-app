import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskPriority } from '@/lib/api/client';
import { TASK_PRIORITIES } from '@/constants/Config';

interface TaskEditModalProps {
  visible: boolean;
  task: Task;
  onSave: (updates: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function TaskEditModal({ 
  visible, 
  task, 
  onSave, 
  onCancel, 
  isLoading 
}: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.due_date || new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>(task.priority || 'Medium');

  // Reset form when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.due_date || new Date().toISOString().split('T')[0]);
    setPriority(task.priority || 'Medium');
  }, [task]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      return;
    }

    const updates = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate,
      priority,
    };

    await onSave(updates);
  };

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const adjustDate = (days: number) => {
    const currentDate = new Date(dueDate);
    currentDate.setDate(currentDate.getDate() + days);
    setDueDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Edit Task</Text>
          
          <TouchableOpacity 
            onPress={handleSave} 
            style={[
              styles.headerButton,
              (!title.trim() || !description.trim() || isLoading) && styles.disabledButton
            ]}
            disabled={!title.trim() || !description.trim() || isLoading}
          >
            <Text style={[
              styles.saveText,
              (!title.trim() || !description.trim() || isLoading) && styles.disabledText
            ]}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title..."
              maxLength={100}
              editable={!isLoading}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description..."
              multiline
              numberOfLines={4}
              maxLength={500}
              editable={!isLoading}
            />
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <View style={styles.dateContainer}>
              <Text style={styles.dateDisplay}>
                {formatDateForDisplay(dueDate)}
              </Text>
              <View style={styles.dateControls}>
                <TouchableOpacity 
                  onPress={() => adjustDate(-1)} 
                  style={styles.dateButton}
                  disabled={isLoading}
                >
                  <Ionicons name="remove" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => adjustDate(1)} 
                  style={styles.dateButton}
                  disabled={isLoading}
                >
                  <Ionicons name="add" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {TASK_PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonSelected
                  ]}
                  onPress={() => setPriority(p)}
                  disabled={isLoading}
                >
                  <Text style={[
                    styles.priorityButtonText,
                    priority === p && styles.priorityButtonTextSelected
                  ]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Date Shortcuts */}
          <View style={styles.section}>
            <Text style={styles.label}>Quick Date</Text>
            <View style={styles.quickDateContainer}>
              <TouchableOpacity 
                onPress={() => setDueDate(new Date().toISOString().split('T')[0])}
                style={styles.quickDateButton}
                disabled={isLoading}
              >
                <Text style={styles.quickDateText}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDueDate(tomorrow.toISOString().split('T')[0]);
                }}
                style={styles.quickDateButton}
                disabled={isLoading}
              >
                <Text style={styles.quickDateText}>Tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setDueDate(nextWeek.toISOString().split('T')[0]);
                }}
                style={styles.quickDateButton}
                disabled={isLoading}
              >
                <Text style={styles.quickDateText}>Next Week</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'right',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateDisplay: {
    fontSize: 16,
    color: '#1F2937',
  },
  dateControls: {
    flexDirection: 'row',
    gap: 8,
  },
  dateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  priorityButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  priorityButtonTextSelected: {
    color: '#FFFFFF',
  },
  quickDateContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quickDateButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  quickDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
});