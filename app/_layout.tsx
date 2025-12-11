import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { setupDeepLinking, supabase } from '@/lib/supabase';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  );
}
