/**
 * Firebase config bootstrap (React Native Firebase)
 *
 * Con @react-native-firebase no hace falta inicializar con apiKey aquí:
 * la configuración nativa se lee de `android/app/google-services.json`.
 * Este archivo existe para forzar un único punto de importación si quieres
 * garantizar que Firebase se “cargue” al arrancar la app.
 */

import firebaseApp from '@react-native-firebase/app';

export default firebaseApp;

