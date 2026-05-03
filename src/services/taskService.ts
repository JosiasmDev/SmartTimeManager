/**
 * Task Service - CRUD de tareas con Firebase Firestore
 * Incluye creación, lectura en tiempo real, actualización y eliminación
 */

import firestore from '@react-native-firebase/firestore';
import {FIREBASE_COLLECTIONS} from './firebase';
import {Task, TaskData} from '../utils/priorities';

/**
 * Añadir una nueva tarea a Firestore
 * Guarda la tarea dentro de la subcolección tasks del usuario
 *
 * @param userId - UID del usuario logueado
 * @param taskData - Datos de la tarea a guardar
 * @returns ID del documento creado
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

  return docRef.id;
}

/**
 * Suscribirse a las tareas del usuario en tiempo real
 * Usa onSnapshot para escuchar cambios y actualizar automáticamente
 *
 * @param userId - UID del usuario logueado
 * @param callback - Función que recibe el array de tareas actualizado
 * @returns Función para cancelar la suscripción (llamar en cleanup del useEffect)
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
 * Actualizar una tarea existente
 *
 * @param userId - UID del usuario logueado
 * @param taskId - ID del documento de la tarea
 * @param data - Campos a actualizar
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

  // Convertir deadline a Timestamp si está presente
  if (data.deadline) {
    updateData.deadline = firestore.Timestamp.fromDate(data.deadline);
  }

  await firestore()
    .collection(FIREBASE_COLLECTIONS.USERS)
    .doc(userId)
    .collection(FIREBASE_COLLECTIONS.TASKS)
    .doc(taskId)
    .update(updateData);
}

/**
 * Eliminar una tarea
 *
 * @param userId - UID del usuario logueado
 * @param taskId - ID del documento de la tarea a eliminar
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
}
