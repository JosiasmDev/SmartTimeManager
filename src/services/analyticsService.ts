/**
 * Analytics Service - Eventos y screen tracking con Firebase Analytics
 *
 * Nota: Requiere @react-native-firebase/analytics instalado.
 */

import analytics from '@react-native-firebase/analytics';

export async function setAnalyticsUserId(userId: string | null): Promise<void> {
  try {
    await analytics().setUserId(userId);
  } catch (error) {
    console.warn('Analytics setUserId error:', error);
  }
}

export async function logScreenView(screenName: string): Promise<void> {
  try {
    await analytics().logScreenView({ screen_name: screenName });
  } catch (error) {
    console.warn('Analytics logScreenView error:', error);
  }
}

export async function logEvent(
  name: string,
  params?: Record<string, unknown>,
): Promise<void> {
  try {
    await analytics().logEvent(name, params);
  } catch (error) {
    console.warn(`Analytics logEvent(${name}) error:`, error);
  }
}

export async function logLogin(method: 'email'): Promise<void> {
  try {
    await analytics().logLogin({ method });
  } catch (error) {
    console.warn('Analytics logLogin error:', error);
  }
}

export async function logSignUp(method: 'email'): Promise<void> {
  try {
    await analytics().logSignUp({ method });
  } catch (error) {
    console.warn('Analytics logSignUp error:', error);
  }
}
