<<<<<<< HEAD
export { useColorScheme } from 'react-native';
=======
import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useTheme() {
  const colorScheme = useNativeColorScheme();
  return { colorScheme };
}
>>>>>>> test-fix
