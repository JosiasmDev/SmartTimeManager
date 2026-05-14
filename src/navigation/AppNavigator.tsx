/**
 * AppNavigator - Navegador raíz de la aplicación
 * Decide si mostrar AuthNavigator o MainTabNavigator
 * según el estado de autenticación del usuario
 */

import React, { useRef } from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../store/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import Colors from '../utils/colors';
import { logScreenView } from '../services/analyticsService';

const navigationRef = createNavigationContainerRef();

const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  const currentRouteNameRef = useRef<string | undefined>(undefined);

  // Mostrar spinner mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        const routeName = navigationRef.getCurrentRoute()?.name;
        currentRouteNameRef.current = routeName;
        if (routeName) {
          void logScreenView(routeName);
        }
      }}
      onStateChange={() => {
        const previousRouteName = currentRouteNameRef.current;
        const currentRouteName = navigationRef.getCurrentRoute()?.name;
        if (currentRouteName && previousRouteName !== currentRouteName) {
          currentRouteNameRef.current = currentRouteName;
          void logScreenView(currentRouteName);
        }
      }}
    >
      {user ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});

export default AppNavigator;
