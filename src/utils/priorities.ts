/**
 * Priority definitions and helper functions
 * Define las prioridades y estados de las tareas
 */

import Colors from './colors';

export enum Priority {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskData {
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Devuelve el color asociado a una prioridad
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case Priority.URGENT:
      return Colors.urgent;
    case Priority.HIGH:
      return Colors.high;
    case Priority.MEDIUM:
      return Colors.medium;
    case Priority.LOW:
      return Colors.low;
    default:
      return Colors.textSecondary;
  }
}

/**
 * Devuelve la etiqueta en español de una prioridad
 */
export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case Priority.URGENT:
      return 'Urgente';
    case Priority.HIGH:
      return 'Alta';
    case Priority.MEDIUM:
      return 'Media';
    case Priority.LOW:
      return 'Baja';
    default:
      return 'Sin prioridad';
  }
}

/**
 * Devuelve el color asociado a un estado
 */
export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.PENDING:
      return Colors.warning;
    case TaskStatus.IN_PROGRESS:
      return Colors.inProgress;
    case TaskStatus.COMPLETED:
      return Colors.completed;
    default:
      return Colors.textSecondary;
  }
}

/**
 * Devuelve la etiqueta en español de un estado
 */
export function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.PENDING:
      return 'Pendiente';
    case TaskStatus.IN_PROGRESS:
      return 'En Progreso';
    case TaskStatus.COMPLETED:
      return 'Completada';
    default:
      return 'Desconocido';
  }
}

/**
 * Ordena tareas por prioridad (urgente primero) y luego por deadline
 */
export function sortTasks(tasks: Task[]): Task[] {
  const priorityOrder = {
    [Priority.URGENT]: 0,
    [Priority.HIGH]: 1,
    [Priority.MEDIUM]: 2,
    [Priority.LOW]: 3,
  };

  return [...tasks].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}
