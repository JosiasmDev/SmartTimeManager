import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';
import Colors from '../utils/colors';

const OfflineBanner: React.FC = () => {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();

  // Si estamos conectados o si el estado es desconocido, no mostramos nada
  if (netInfo.isConnected !== false) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 10 }]}>
      <Text style={styles.text}>Sin conexión a Internet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: Colors.error || '#FF3B30',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default OfflineBanner;
