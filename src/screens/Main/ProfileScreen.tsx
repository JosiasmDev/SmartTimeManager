/**
 * ProfileScreen - Pantalla de perfil del usuario
 * Muestra info del usuario, estadísticas de tareas y botón de cerrar sesión
 */

import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import Colors from '../../utils/colors';
import CustomButton from '../../components/CustomButton';
import {useAuth} from '../../store/AuthContext';

const ProfileScreen: React.FC = () => {
  const {user, signOut} = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
      </View>

      {/* Info del usuario */}
      <View style={styles.infoSection}>
        <Text style={styles.userName}>
          {user?.email?.split('@')[0] || 'Usuario'}
        </Text>
        <Text style={styles.userEmail}>{user?.email || 'Sin email'}</Text>
      </View>

      {/* Tarjeta de info */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>UID</Text>
          <Text style={styles.cardValue} numberOfLines={1}>
            {user?.uid || 'N/A'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Cuenta creada</Text>
          <Text style={styles.cardValue}>
            {user?.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES')
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Último acceso</Text>
          <Text style={styles.cardValue}>
            {user?.metadata?.lastSignInTime
              ? new Date(user.metadata.lastSignInTime).toLocaleDateString(
                  'es-ES',
                )
              : 'N/A'}
          </Text>
        </View>
      </View>

      {/* Botón cerrar sesión */}
      <View style={styles.actions}>
        <CustomButton
          title="Cerrar Sesión"
          onPress={handleSignOut}
          variant="danger"
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 32,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  actions: {
    marginTop: 'auto',
    marginBottom: 40,
  },
});

export default ProfileScreen;
