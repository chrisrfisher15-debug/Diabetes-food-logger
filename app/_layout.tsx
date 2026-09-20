import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';

import { MealLogProvider } from '../src/context';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <MealLogProvider>
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
          <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
        </Stack>
      </ThemeProvider>
    </MealLogProvider>
  );
}
