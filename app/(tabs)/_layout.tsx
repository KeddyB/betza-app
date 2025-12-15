import { Tabs, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/use-color-scheme'; // Updated import
import { Colors } from '@/constants/theme';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, TextInput, StyleSheet, Text, Pressable } from 'react-native'; // Import TouchableOpacity
import { useState } from 'react';
import { useCart } from '../context/CartContext';

function SearchBar({ colorScheme }: { colorScheme: 'light' | 'dark' | null | undefined }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      router.push(`/search?q=${searchQuery.trim()}`);
    }
  };

  return (
    <View style={[styles.searchContainer, { backgroundColor: Colors[colorScheme ?? 'light'].inputBackground }]}>
      <Ionicons name="search" size={20} color={Colors[colorScheme ?? 'light'].text} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
        placeholder="Search..."
        placeholderTextColor={Colors[colorScheme ?? 'light'].text + '80'}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
    </View>
  );
}

export default function TabLayout() {
  const { colorScheme, toggleTheme } = useTheme(); // Use the new useTheme hook
  const { cart } = useCart();
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].primary,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderTopColor: Colors[colorScheme ?? 'light'].border,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: true,
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
          header: () => (
            <View style={[styles.customHeader, { backgroundColor: Colors[colorScheme ?? 'light'].background, borderBottomColor: Colors[colorScheme ?? 'light'].border }]}>
              <View style={styles.headerTopRow}>
                <Pressable onPress={toggleTheme}>
                  <Ionicons
                    name={colorScheme === 'light' ? 'moon' : 'sunny'}
                    size={24}
                    color={Colors[colorScheme ?? 'light'].text}
                  />
                </Pressable>
              </View>
              <SearchBar colorScheme={colorScheme} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          headerShown: false, // Set to false
          tabBarIcon: ({ color }) => (
            <View style={{ width: 24, height: 24, margin: 5 }}>
              <MaterialIcons name="shopping-cart" size={24} color={color} />
              {totalCartItems > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={[styles.badgeText, {color: Colors[colorScheme ?? 'light'].text}]}>{totalCartItems}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false, // Set to false
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b', // This will be overridden by inline style
    borderRadius: 8,
    paddingHorizontal: 12,
    width: '90%',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'transparent', // Make inner transparent
    borderColor: '#ef4444', // Red border
    borderWidth: 2,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  customHeader: {
    paddingTop: 50, // Adjust based on status bar height for iOS/Android
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
