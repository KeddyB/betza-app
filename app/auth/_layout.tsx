import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up-google" />
      <Stack.Screen name="sign-in-google" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
