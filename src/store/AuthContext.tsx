/**
 * AuthContext - Contexto global de autenticación
 * Provee el estado del usuario logueado a toda la app
 * Usa onAuthStateChanged para reaccionar automáticamente a cambios de sesión
 */

import React, {createContext, useContext, useEffect, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  logLogin,
  logSignUp,
  setAnalyticsUserId,
} from '../services/analyticsService';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

/**
 * Hook para acceder al contexto de autenticación
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

/**
 * AuthProvider - Componente que envuelve la app y provee el estado de auth
 */
export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = auth().onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
      void setAnalyticsUserId(firebaseUser?.uid ?? null);
      setLoading(false);
    });

    // Limpiar suscripción al desmontar
    return unsubscribe;
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
    void logLogin('email');
  };

  const handleSignUp = async (email: string, password: string) => {
    await auth().createUserWithEmailAndPassword(email, password);
    void logSignUp('email');
  };

  const handleSignOut = async () => {
    await auth().signOut();
    void setAnalyticsUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
