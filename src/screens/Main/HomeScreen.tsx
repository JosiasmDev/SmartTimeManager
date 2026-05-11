/**
 * HomeScreen - Pantalla principal con lista de tareas en tiempo real
 * Usa subscribeToTasks con onSnapshot para actualizaciones automáticas
 * Muestra barra de estado con colores de prioridad en la parte superior
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Colors from '../../utils/colors';
import {useAuth} from '../../store/AuthContext';
import {subscribeToTasks} from '../../services/taskService';
import {Task, sortTasks, Priority, TaskStatus} from '../../utils/priorities';
import TaskCard from '../../components/TaskCard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  CreateTask: {taskToEdit?: Task};
  Home: undefined;
};

const HomeScreen: React.FC = () => {
  const {user} = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleTaskPress = (task: Task) => {
    navigation.navigate('CreateTask', {
      taskToEdit: task,
    });
  };

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToTasks(user.uid, updatedTasks => {
      setTasks(sortTasks(updatedTasks));
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusBarColor = (): string => {
    if (tasks.length === 0) return Colors.rest;

    const pendingTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED);
    if (pendingTasks.length === 0) return Colors.completed;

    const hasUrgent = pendingTasks.some(t => t.priority === Priority.URGENT);
    if (hasUrgent) return Colors.urgent;

    const hasInProgress = pendingTasks.some(
      t => t.status === TaskStatus.IN_PROGRESS,
    );
    if (hasInProgress) return Colors.inProgress;

    return Colors.medium;
  };

  const getStatusMessage = (): string => {
    if (tasks.length === 0) return '🌟 Sin tareas pendientes';

    const pending = tasks.filter(
      t => t.status !== TaskStatus.COMPLETED,
    ).length;

    const completed = tasks.filter(
      t => t.status === TaskStatus.COMPLETED,
    ).length;

    if (pending === 0) return '🎉 ¡Todas las tareas completadas!';

    const hasUrgent = tasks.some(
      t => t.priority === Priority.URGENT && t.status !== TaskStatus.COMPLETED,
    );

    if (hasUrgent) return '🔴 Tienes tareas urgentes';

    return `📋 ${pending} pendiente${pending > 1 ? 's' : ''} · ${completed} completada${completed > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.statusBar, {backgroundColor: getStatusBarColor()}]}>
        <Text style={styles.statusText}>{getStatusMessage()}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hola{user?.email ? `, ${user.email.split('@')[0]}` : ''} 👋
        </Text>
        <Text style={styles.headerSubtitle}>
          {tasks.length > 0
            ? `Tienes ${tasks.length} tarea${tasks.length > 1 ? 's' : ''}`
            : 'Tu agenda está vacía'}
        </Text>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyTitle}>No hay tareas todavía</Text>
          <Text style={styles.emptySubtitle}>
            Toca "Nueva Tarea" para añadir tu primera tarea
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TaskCard task={item} onPress={handleTaskPress} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  statusBar: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  statusText: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {fontSize: 64, marginBottom: 16},
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;