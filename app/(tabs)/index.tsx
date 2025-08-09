import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const { isAuthenticated, user, tasks } = useAuth();

  const totalTasks = tasks.todo.length + tasks.in_progress.length + tasks.done.length;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/(tabs)/board');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="grid" size={48} color="#007AFF" />
            </View>
            <Text style={styles.logoText}>Projects Board</Text>
          </View>
          
          <Text style={styles.subtitle}>
            {isAuthenticated ? `Welcome back, ${user?.company_name}!` : 'Organize your tasks with ease'}
          </Text>
        </View>

        {/* Stats (if authenticated) */}
        {isAuthenticated && (
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { borderLeftColor: '#007AFF' }]}>
                <Text style={styles.statNumber}>{tasks.todo.length}</Text>
                <Text style={styles.statLabel}>To Do</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#FF9500' }]}>
                <Text style={styles.statNumber}>{tasks.in_progress.length}</Text>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#34C759' }]}>
                <Text style={styles.statNumber}>{tasks.done.length}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>
          </View>
        )}

        {/* Features (if not authenticated) */}
        {!isAuthenticated && (
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark-circle" size={32} color="#34C759" />
              </View>
              <Text style={styles.featureTitle}>Task Management</Text>
              <Text style={styles.featureDescription}>
                Create, organize, and track your tasks across different stages
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="people" size={32} color="#FF9500" />
              </View>
              <Text style={styles.featureTitle}>Team Collaboration</Text>
              <Text style={styles.featureDescription}>
                Multi-tenant support for different companies and teams
              </Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.featureIcon}>
                <Ionicons name="phone-portrait" size={32} color="#007AFF" />
              </View>
              <Text style={styles.featureTitle}>Mobile Optimized</Text>
              <Text style={styles.featureDescription}>
                Native iOS experience with intuitive touch interactions
              </Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleGetStarted}>
          <Text style={styles.actionButtonText}>
            {isAuthenticated ? 'Go to Board' : 'Get Started'}
          </Text>
          <Ionicons 
            name={isAuthenticated ? "grid" : "arrow-forward"} 
            size={20} 
            color="#FFFFFF" 
            style={styles.actionButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  feature: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 'auto',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonIcon: {
    marginLeft: 12,
  },
});
