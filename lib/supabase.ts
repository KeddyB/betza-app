import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We will handle this manually
    flowType: 'pkce',
  },
});

// 🔥 The redirect URL now points to our new callback screen
export const authOptions = {
  redirectTo:
    Platform.OS === 'web'
      ? `${window.location.origin}/auth/callback`
      : `betza://auth/callback`,
};

export const setupDeepLinking = () => {
  const handleDeepLink = (url: string) => {
    if (!url) return;
    const { path, queryParams } = Linking.parse(url);

    // Only handle the code exchange if the path is the auth callback
    if (path === 'auth/callback' && queryParams?.code) {
      const code = queryParams.code as string;
      supabase.auth.exchangeCodeForSession(code);
    }
  };

  // Handle initial URL on app open
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLink(url);
    }
  });

  // Listen for subsequent URLs while the app is open
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  // Clean up the listener on unmount
  return () => {
    subscription.remove();
  };
};
