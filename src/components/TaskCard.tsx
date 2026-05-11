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
  TaskStatus,
} from '../utils/priorities';
import {Swipeable} from 'react-native-gesture-handler';

interface TaskCardProps {
  task: Task;
  onPress?: (task: Task) => void;
  onComplete?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({task, onPress, onComplete, onDelete}) => {
  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);
  const isCompleted = task.status === TaskStatus.COMPLETED;

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

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onDelete?.(task)}
        activeOpacity={0.8}>
        <Text style={styles.deleteText}>Borrar</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[styles.card, isCompleted && styles.cardCompleted]}
        onPress={() => onPress?.(task)}
        activeOpacity={0.7}>
        {/* Franja de prioridad lateral */}
        <View
          style={[styles.priorityStrip, {backgroundColor: isCompleted ? Colors.textMuted : priorityColor}]}
        />

        {/* Botón de completar */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => onComplete?.(task)}
          activeOpacity={0.6}>
          <View style={[styles.checkCircle, isCompleted && styles.checkCircleCompleted]}>
            {isCompleted && <Text style={styles.checkIcon}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Header: título + badge de prioridad */}
          <View style={styles.header}>
            <Text style={[styles.title, isCompleted && styles.titleCompleted]} numberOfLines={1}>
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
    </Swipeable>
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
  cardCompleted: {
    opacity: 0.6,
  },
  priorityStrip: {
    width: 5,
  },
  completeButton: {
    paddingLeft: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkIcon: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
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
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
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
  deleteAction: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
    borderRadius: 14,
    marginLeft: 10,
  },
  deleteText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TaskCard;
