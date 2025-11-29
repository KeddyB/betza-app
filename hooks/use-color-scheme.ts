import { useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

export function useTheme() {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      if (themePreference === 'system') {
        setColorScheme(newColorScheme);
      }
    });

    return () => subscription.remove();
  }, [themePreference]);

  const toggleTheme = () => {
    const nextTheme = colorScheme === 'dark' ? 'light' : 'dark';
    setThemePreference(nextTheme);
    setColorScheme(nextTheme);
  };

  const setSystemTheme = () => {
    setThemePreference('system');
    setColorScheme(Appearance.getColorScheme());
  };

  const currentTheme = themePreference === 'system' ? Appearance.getColorScheme() : colorScheme;

  return { colorScheme: currentTheme, themePreference, toggleTheme, setSystemTheme };
}

