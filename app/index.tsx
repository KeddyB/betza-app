<<<<<<< HEAD
import { useRef, useEffect } from 'react';
import { Animated, StyleSheet, Text, View, useColorScheme } from 'react-native';
=======
import { useTheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
>>>>>>> test-fix

// This is the initial splash screen.
// The actual routing is handled by the RootLayout in app/_layout.tsx
export default function SplashScreen() {
<<<<<<< HEAD
  const colorScheme = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
=======
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    text: isDark ? '#ffffff' : '#000000',
  };
>>>>>>> test-fix

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const colors = {
    background: colorScheme === 'dark' ? '#1a1a1a' : '#ffffff',
    text: colorScheme === 'dark' ? '#ffffff' : '#000000',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Text style={[styles.logo, { color: colors.text }]}>Betza</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
  },
});
