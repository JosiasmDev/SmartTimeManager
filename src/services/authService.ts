/**
 * Auth Service - Servicios de autenticación con Firebase
 * Funciones para login, registro y cierre de sesión
 */

import auth from '@react-native-firebase/auth';

/**
 * Registrar un nuevo usuario con email y contraseña
 */
export async function signUp(
  email: string,
  password: string,
): Promise<void> {
  await auth().createUserWithEmailAndPassword(email, password);
}

/**
 * Iniciar sesión con email y contraseña
 */
export async function signIn(
  email: string,
  password: string,
): Promise<void> {
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
