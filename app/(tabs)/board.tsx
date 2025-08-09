import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import KanbanBoard from '@/components/kanban/KanbanBoard';

export default function BoardScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  // Don't render anything while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <KanbanBoard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});