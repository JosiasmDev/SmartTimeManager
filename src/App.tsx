/**
 * App.tsx - Punto de entrada principal de SmartTimeManager
 * Envuelve la app con AuthProvider y SafeAreaProvider
 * para proveer autenticación global y áreas seguras
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {AuthProvider} from './store/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import './services/firebaseConfig';
import Toast from 'react-native-toast-message';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0F0F1A" />
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </SafeAreaProvider>
      <Toast />
    </GestureHandlerRootView>
  );
};

export default App;
