/**
 * AppNavigator - Navegador raíz de la aplicación
 * Decide si mostrar AuthNavigator o MainTabNavigator
 * según el estado de autenticación del usuario
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useAuth} from '../store/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import Colors from '../utils/colors';

const AppNavigator: React.FC = () => {
  const {user, loading} = useAuth();

  // Mostrar spinner mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
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
