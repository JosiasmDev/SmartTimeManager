/**
 * Firebase initialization
 * Configuración base de Firebase para la app
 *
 * NOTA: Para que Firebase funcione necesitas:
 * 1. Crear un proyecto en https://console.firebase.google.com
 * 2. Descargar google-services.json y colocarlo en android/app/
 * 3. Descargar GoogleService-Info.plist y colocarlo en ios/OrganizadorApp/
 * 4. Seguir la guía de @react-native-firebase/app para configurar los archivos nativos
 *
 * La inicialización de Firebase se hace automáticamente con @react-native-firebase
 * al tener los archivos de configuración en su lugar.
 */

// Firebase se inicializa automáticamente con @react-native-firebase/app
// Solo necesitas importar los módulos que necesites:
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';

export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  TASKS: 'tasks',
} as const;

export default {};
