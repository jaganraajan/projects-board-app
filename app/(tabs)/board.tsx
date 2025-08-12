import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import KanbanBoard from '@/components/kanban/KanbanBoard';

export default function BoardScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      hasRedirected.current = true;
      router.replace('/auth/login');
    }
  }, [isLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <KanbanBoard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});