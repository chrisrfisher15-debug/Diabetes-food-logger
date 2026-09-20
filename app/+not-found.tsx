import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors, type } from '../src/theme';

export default function NotFoundScreen() {
  const colors = useThemeColors();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>This screen does not exist.</Text>
        <Link href="/" style={styles.link} accessibilityRole="link">
          <Text style={[styles.linkText, { color: colors.primary }]}>Go back to meal history</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: type.subtitle,
    fontWeight: '700',
    textAlign: 'center',
  },
  link: {
    marginTop: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: type.body,
    fontWeight: '700',
  },
});
