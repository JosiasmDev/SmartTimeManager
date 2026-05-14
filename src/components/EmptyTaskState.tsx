import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../utils/colors';

const EmptyTaskState: React.FC = () => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>No hay tareas todavía</Text>
      <Text style={styles.emptySubtitle}>
        Toca "Nueva Tarea" para añadir tu primera tarea
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
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

export default EmptyTaskState;
