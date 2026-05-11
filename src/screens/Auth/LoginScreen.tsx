/**
 * LoginScreen - Pantalla de inicio de sesión (solo UI)
 * Formulario con email y contraseña, enlace a registro
 */


import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import Colors from '../../utils/colors';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import FullScreenLoader from '../../components/FullScreenLoader';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log('Error login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        {/* Header / Logo */}
        <View style={styles.header}>
          <Text style={styles.logoEmoji}>⏱️</Text>
          <Text style={styles.appName}>SmartTime</Text>
          <Text style={styles.appNameAccent}>Manager</Text>
          <Text style={styles.subtitle}>
            Organiza tu tiempo de forma inteligente
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <CustomInput
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <CustomButton
            title={isLoading ? "Entrando..." : "Entrar"}
            onPress={handleLogin}
            size="large"
            style={styles.loginButton}
          />
        </View>

        {/* Link a registro */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 1,
  },
  appNameAccent: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: -6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  form: {
    marginBottom: 32,
  },
  loginButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;