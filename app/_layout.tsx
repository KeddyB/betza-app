import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import 'react-native-quick-crypto';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme, View, ActivityIndicator } from 'react-native';

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return; // Wait until the auth state is known.

    const inAuthGroup = segments[0] === 'auth';

    // If the user has a session and is on an auth screen, move them to the main app.
    if (session && inAuthGroup) {
      router.replace('/(tabs)/index');
    }
    // If the user does not have a session and is not on an auth screen, move them to the auth flow.
    else if (!session && !inAuthGroup) {
      router.replace('/auth/get-started');
    }

  }, [session, loading, segments]);

  // Render a loading indicator while the auth state is being determined.
  if (loading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
  }

  return (
    <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <ToastProvider>
          <CartProvider>
            <RootLayoutNav />
            <StatusBar style="auto" />
          </CartProvider>
        </ToastProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
