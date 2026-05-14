/**
 * Task Service - CRUD de tareas con Firebase Firestore
 * Incluye creación, lectura en tiempo real, actualización y eliminación
 */

import firestore from '@react-native-firebase/firestore';
import { FIREBASE_COLLECTIONS } from './firebase';
import { Task, TaskData, TaskStatus } from '../utils/priorities';
import { logEvent } from './analyticsService';

/**
 * ACTUALIZAR DETALLES DE UNA TAREA (CORREGIDO)
 */
export const updateTaskDetails = async (
  userId: string,
  taskId: string,
  data: any,
) => {
  await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIREBASE_COLLECTIONS.TASKS)
    .doc(taskId)
    .update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
};

/**
 * Añadir una nueva tarea a Firestore
 * Guarda la tarea dentro de la subcolección tasks del usuario
 */
export async function addTask(
  userId: string,
  taskData: TaskData,
): Promise<string> {
  const docRef = await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIREBASE_COLLECTIONS.TASKS)
    .add({
      ...taskData,
      deadline: firestore.Timestamp.fromDate(taskData.deadline),
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

  void logEvent('task_created', {
    userId,
    priority: taskData.priority,
    status: taskData.status,
  });

  return docRef.id;
}

/**
 * Suscribirse a las tareas del usuario en tiempo real
 */
export function subscribeToTasks(
  userId: string,
  callback: (tasks: Task[]) => void,
): () => void {
  const unsubscribe = firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIREBASE_COLLECTIONS.TASKS)
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      querySnapshot => {
        const tasks: Task[] = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();

          tasks.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            priority: data.priority,
            status: data.status,
            deadline: data.deadline?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          });
        });

        callback(tasks);
      },
      error => {
        console.error('Error escuchando tareas:', error);
      },
    );

  return unsubscribe;
}

/**
 * Actualizar una tarea existente (alternativa genérica)
 */
export async function updateTask(
  userId: string,
  taskId: string,
  data: Partial<TaskData>,
): Promise<void> {
  const updateData: Record<string, unknown> = {
    ...data,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  if (data.deadline) {
    updateData.deadline = firestore.Timestamp.fromDate(data.deadline);
  }

  await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIREBASE_COLLECTIONS.TASKS)
    .doc(taskId)
    .update(updateData);

  void logEvent('task_updated', {
    userId,
    taskId,
    priority: data.priority,
    status: data.status,
  });
}

/**
 * Eliminar tarea
 */
export async function deleteTask(
  userId: string,
  taskId: string,
): Promise<void> {
  await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIREBASE_COLLECTIONS.TASKS)
    .doc(taskId)
    .delete();

  void logEvent('task_deleted', { userId, taskId });
}

/**
 * Actualizar el estado de una tarea
 *
 * @param userId - UID del usuario logueado
 * @param taskId - ID del documento de la tarea
 * @param newStatus - Nuevo estado de la tarea
 */
export async function updateTaskStatus(
  userId: string,
  taskId: string,
  newStatus: TaskStatus,
): Promise<void> {
  await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIREBASE_COLLECTIONS.TASKS)
    .doc(taskId)
    .update({
      status: newStatus,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

  void logEvent('task_status_updated', {
    userId,
    taskId,
    status: newStatus,
  });
}
