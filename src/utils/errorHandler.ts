import Toast from 'react-native-toast-message';

/**
 * Muestra un mensaje de error tipo Toast, opcionalmente traduciendo
 * códigos de error comunes de Firebase.
 *
 * @param defaultMessage Mensaje a mostrar si no hay código o no se reconoce
 * @param firebaseCode Código de error devuelto por Firebase Auth/Firestore
 */
export const showError = (defaultMessage: string, firebaseCode?: string) => {
  let message = defaultMessage;

  if (firebaseCode) {
    switch (firebaseCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Email o contraseña incorrectos.';
        break;
      case 'auth/invalid-email':
        message = 'El formato del email no es válido.';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos. Espera unos minutos.';
        break;
      case 'auth/email-already-in-use':
        message = 'Este email ya está registrado. Prueba a iniciar sesión.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña es demasiado débil (mínimo 6 caracteres).';
        break;
      case 'auth/network-request-failed':
        message = 'Error de conexión. Revisa tu internet.';
        break;
    }
  }

  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    position: 'top',
  });
};

/**
 * Muestra un mensaje de éxito tipo Toast.
 *
 * @param message Mensaje de éxito
 */
export const showSuccess = (message: string) => {
  Toast.show({
    type: 'success',
    text1: '✅ Éxito',
    text2: message,
    position: 'top',
  });
};
