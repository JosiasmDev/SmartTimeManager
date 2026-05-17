/**
 * Auth Service - Servicios de autenticación con Firebase
 * Funciones para login, registro y cierre de sesión
 */

import auth from '@react-native-firebase/auth';

/**
 * Registrar un nuevo usuario con email, contraseña y nombre
 */
export async function registerUser(email: string, password: string, name: string): Promise<void> {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  if (name) {
    await userCredential.user.updateProfile({ displayName: name });
  }
}

/**
 * Iniciar sesión con email y contraseña
 */
export async function loginUser(email: string, password: string): Promise<void> {
  await auth().signInWithEmailAndPassword(email, password);
}

/**
 * Cerrar sesión
 */
export async function signOutUser(): Promise<void> {
  await auth().signOut();
}

/**
 * Obtener el UID del usuario actualmente logueado
 */
export function getCurrentUserId(): string | undefined {
  return auth().currentUser?.uid;
}

/**
 * Obtener el usuario actualmente logueado
 */
export function getCurrentUser() {
  return auth().currentUser;
}
