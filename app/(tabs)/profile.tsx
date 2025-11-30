import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function ProfilePage() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/get-started');
  };

  const handleLogin = () => {
    router.push('/auth/sign-in');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {user ? (
        <>
          <Text style={[styles.email, { color: Colors[colorScheme ?? 'light'].text }]}>{user.email}</Text>
          <Button title="Logout" onPress={handleLogout} color={Colors[colorScheme ?? 'light'].notification} />
        </>
      ) : (
        <Button title="Login" onPress={handleLogin} color={Colors.light.tint} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  email: {
    fontSize: 18,
    marginBottom: 24,
  },
});
