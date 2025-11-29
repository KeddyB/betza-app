import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useTheme } from '@/hooks/use-color-scheme'; // Updated import
import { setupDeepLinking, supabase } from '@/lib/supabase';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { colorScheme } = useTheme(); // Use the new useTheme hook
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    // Setup deep linking for OAuth
    const unsubscribeDeepLink = setupDeepLinking();

    return () => {
      subscription?.unsubscribe();
      unsubscribeDeepLink();
    };
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <ToastProvider>
      <CartProvider>
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
      </CartProvider>
    </ToastProvider>
  );
}
