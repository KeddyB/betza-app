<<<<<<< HEAD
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import 'react-native-quick-crypto';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
=======
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
>>>>>>> parent of 4e60c46 (one step forward 20 steps nack)
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
<<<<<<< HEAD
import { useColorScheme, View, ActivityIndicator } from 'react-native';
=======

import { useColorScheme } from '@/hooks/use-color-scheme';
import { setupDeepLinking, supabase } from '@/lib/supabase';
>>>>>>> parent of 4e60c46 (one step forward 20 steps nack)

export const unstable_settings = {
  initialRouteName: 'index',
};

<<<<<<< HEAD
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
=======
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> parent of 4e60c46 (one step forward 20 steps nack)

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
<<<<<<< HEAD
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
=======
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="auth"
              options={{ headerShown: false }}
              redirect={false}
              initialRouteName="get-started"
            />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
>>>>>>> parent of 4e60c46 (one step forward 20 steps nack)
  );
}
