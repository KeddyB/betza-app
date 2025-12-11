<<<<<<< HEAD
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfilePage() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { user, loading } = useAuth();
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    if (user && user.user_metadata) {
      const fullName = user.user_metadata.full_name || '';
      setFirstName(fullName.split(' ')[0]);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/get-started');
  };

  const handleLogin = () => {
    router.push('/auth/get-started');
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={themeColors.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {user ? (
        <>
          <View style={styles.profileHeader}>
            <Text style={[styles.welcomeMessage, { color: themeColors.text }]}>Welcome, {firstName}</Text>
            <Text style={[styles.email, { color: themeColors.text + '99' }]}>{user.email}</Text>
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]} onPress={() => router.push('/orders')}>
                <Ionicons name="cube-outline" size={24} color={themeColors.text} />
                <Text style={[styles.menuItemText, { color: themeColors.text }]}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]} onPress={() => router.push('/wishlist')}>
                <Ionicons name="heart-outline" size={24} color={themeColors.text} />
                <Text style={[styles.menuItemText, { color: themeColors.text }]}>Wishlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]} onPress={() => router.push('/account-management')}>
                <Ionicons name="person-outline" size={24} color={themeColors.text} />
                <Text style={[styles.menuItemText, { color: themeColors.text }]}>Account Management</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: themeColors.border }]} onPress={() => router.push('/address-book')}>
                <Ionicons name="home-outline" size={24} color={themeColors.text} />
                <Text style={[styles.menuItemText, { color: themeColors.text }]}>Address Book</Text>
            </TouchableOpacity>
          </View>

          <Pressable style={({ pressed }) => [styles.logoutButton, { backgroundColor: pressed ? themeColors.notification + 'E6' : themeColors.notification }]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: themeColors.text }]}>You are not logged in.</Text>
            <Pressable style={({ pressed }) => [styles.loginButton, { backgroundColor: pressed ? themeColors.primary + 'E6' : themeColors.primary }]} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  profileHeader: {
      alignItems: 'center',
      marginBottom: 32,
  },
  welcomeMessage: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
  },
  email: {
      fontSize: 16,
  },
  menuContainer: {
      flex: 1,
  },
  menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      gap: 16,
  },
  menuItemText: {
      fontSize: 16,
      fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 24,
  },
  loginText: {
      fontSize: 18,
  },
  loginButton: {
      paddingVertical: 14,
      paddingHorizontal: 48,
      borderRadius: 12,
  },
  loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  }
});
=======
import { View, Text } from 'react-native';

export default function ProfilePage() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile</Text>
    </View>
  );
}
>>>>>>> parent of 4e60c46 (one step forward 20 steps nack)
