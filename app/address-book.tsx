<<<<<<< HEAD
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from './context/AuthContext';
=======
import { Text, StyleSheet } from 'react-native';
import React from 'react';
>>>>>>> test-fix
import { SafeAreaView } from 'react-native-safe-area-context';
import AddressSkeleton from '@/components/AddressSkeleton';

export default function AddressBookScreen() {
  const { colorScheme } = useTheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
          setLoading(false);
          return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('address, city, state, postal_code')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;

        if (data) {
          setAddress(data.address || '');
          setCity(data.city || '');
          setState(data.state || '');
          setPostalCode(data.postal_code || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdateAddress = async () => {
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          address,
          city,
          state,
          postal_code: postalCode,
        })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Your address has been updated.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setUpdating(false);
    }
  };

  return (
<<<<<<< HEAD
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Address Book</Text>

      {loading ? (
        <AddressSkeleton />
      ) : (
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: themeColors.text }]}>Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
            value={address}
            onChangeText={setAddress}
            editable={!updating}
          />
          <Text style={[styles.label, { color: themeColors.text }]}>City</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
            value={city}
            onChangeText={setCity}
            editable={!updating}
          />
          <Text style={[styles.label, { color: themeColors.text }]}>State</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
            value={state}
            onChangeText={setState}
            editable={!updating}
          />
          <Text style={[styles.label, { color: themeColors.text }]}>Postal Code</Text>
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text, borderColor: themeColors.border }]}
            value={postalCode}
            onChangeText={setPostalCode}
            editable={!updating}
          />
          <Pressable
            style={({ pressed }) => [styles.button, { backgroundColor: pressed ? themeColors.primary + 'E6' : themeColors.primary, opacity: updating ? 0.6 : 1 }]}
            onPress={handleUpdateAddress}
            disabled={updating}
          >
            {updating ? <ActivityIndicator color="#fff"/> : <Text style={styles.buttonText}>Update Address</Text>}
          </Pressable>
        </View>
      )}
=======
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Address Book</Text>
      <Text>This is where the user&apos;s addresses will be displayed.</Text>
>>>>>>> test-fix
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
});
