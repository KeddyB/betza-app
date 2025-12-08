import 'react-native-url-polyfill/auto';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useColorScheme } from 'react-native';

// This screen's ONLY job is to handle the redirect and navigate.
export default function AuthCallbackScreen() {
  const { code } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [authStatus, setAuthStatus] = useState('pending');

  useEffect(() => {
    const exchangeCode = async () => {
      if (code && typeof code === 'string') {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
          const { data } = await supabase.auth.getUser();
          if (data.user) {
            setAuthStatus('success');
          } else {
            throw new Error('User not found after session exchange');
          }
        } catch (e: any) {
          setAuthStatus('error');
          Alert.alert('Authentication Failed', e.message);
        }
      } else {
        setAuthStatus('error');
        Alert.alert('Authentication Error', 'No authentication code provided.');
      }
    };

    exchangeCode();
  }, [code]);

  useEffect(() => {
    if (authStatus === 'success') {
      router.replace('/(tabs)/index');
    } else if (authStatus === 'error') {
      router.replace('/auth/get-started');
    }
  }, [authStatus]);

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }]}>
      <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
