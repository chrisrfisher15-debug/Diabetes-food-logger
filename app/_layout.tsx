import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { MealLogProvider } from '../src/context';
import { FavoritesProvider } from '../src/favorites-context';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <MealLogProvider>
      <FavoritesProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerTitleStyle: { fontSize: 18, fontWeight: '700' },
              headerBackTitle: 'Back',
            }}>
            <Stack.Screen name="index" options={{ title: 'Meal Log' }} />
            <Stack.Screen name="log/new" options={{ title: 'Log a meal' }} />
            <Stack.Screen name="log/[id]" options={{ title: 'Meal details' }} />
            <Stack.Screen name="favorites/index" options={{ title: 'Favorites' }} />
            <Stack.Screen name="favorites/new" options={{ title: 'New favorite' }} />
            <Stack.Screen name="favorites/[id]" options={{ title: 'Edit favorite' }} />
            <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
          </Stack>
        </ThemeProvider>
      </FavoritesProvider>
    </MealLogProvider>
  );
}
