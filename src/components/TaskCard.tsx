/**
 * TaskCard - Tarjeta que muestra la información de una tarea
 * Con franja de color lateral según prioridad
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../utils/colors';
import {
  Task,
  getPriorityColor,
  getPriorityLabel,
  getStatusLabel,
  getStatusColor,
} from '../utils/priorities';

interface TaskCardProps {
  task: Task;
  onPress?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({task, onPress}) => {
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);

  const formatDate = (date: Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(task)}
      activeOpacity={0.7}>
      {/* Franja de prioridad lateral */}
      <View
        style={[styles.priorityStrip, {backgroundColor: priorityColor}]}
      />

      <View style={styles.content}>
        {/* Header: título + badge de prioridad */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          <View
            style={[styles.priorityBadge, {backgroundColor: priorityColor + '20'}]}>
            <Text style={[styles.priorityText, {color: priorityColor}]}>
              {getPriorityLabel(task.priority)}
            </Text>
          </View>
        </View>

        {/* Descripción */}
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        {/* Footer: fecha + estado */}
        <View style={styles.footer}>
          <Text style={styles.deadline}>📅 {formatDate(task.deadline)}</Text>
          <View
            style={[styles.statusBadge, {backgroundColor: statusColor + '20'}]}>
            <Text style={[styles.statusText, {color: statusColor}]}>
              {getStatusLabel(task.status)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  priorityStrip: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default TaskCard;
