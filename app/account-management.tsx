import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from './context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountManagementScreen() {
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.user_metadata) {
      setFullName(user.user_metadata.full_name || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      Alert.alert('Error updating profile', error.message);
    } else {
      Alert.alert('Success', 'Your profile has been updated.');
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all password fields.');
        return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setLoading(true);
    // Note: Supabase implicitly requires a recent sign-in to update a password.
    // For a better user experience, you could reauthenticate here first.
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      Alert.alert('Error updating password', error.message);
    } else {
      Alert.alert('Success', 'Your password has been updated.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action is irreversible.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            setLoading(true);
            const { error } = await supabase.functions.invoke('delete-user');
            if (error) {
                Alert.alert('Error', 'Could not delete your account. Please try again.');
            } else {
                Alert.alert('Success', 'Your account has been deleted.');
                await supabase.auth.signOut();
            }
            setLoading(false);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Account Management</Text>

      <View style={styles.formSection}>
        <Text style={[styles.label, { color: themeColors.text }]}>Full Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />
        <Pressable
          style={({ pressed }) => [styles.button, { backgroundColor: pressed ? themeColors.primary + 'E6' : themeColors.primary, opacity: loading ? 0.6 : 1 }]}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </Pressable>
      </View>

      <View style={styles.formSection}>
        <Text style={[styles.label, { color: themeColors.text }]}>Change Password</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Current password"
          editable={!loading}
        />
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          editable={!loading}
        />
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm new password"
          editable={!loading}
        />
        <Pressable
          style={({ pressed }) => [styles.button, { backgroundColor: pressed ? themeColors.primary + 'E6' : themeColors.primary, opacity: loading ? 0.6 : 1 }]}
          onPress={handleUpdatePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </Pressable>
      </View>

      <View style={styles.dangerZone}>
        <Pressable
            style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.8 : 1, backgroundColor: loading ? themeColors.notification + '80' : themeColors.notification }]}
            onPress={handleDeleteAccount}
            disabled={loading}
            >
            {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Delete Account</Text>}
            </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerZone: {
      marginTop: 'auto',
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: Colors.light.border,
  },
  deleteButton: {
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
  }
});
