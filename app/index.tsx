import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBanner } from '../src/components/DisclaimerBanner';
import { MealCard } from '../src/components/MealCard';
import { AppButton, ErrorText } from '../src/components/ui';
import { useMealLogs } from '../src/context';
import { type, useThemeColors } from '../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { logs, loading, error } = useMealLogs();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
              Your meal history
            </Text>
            <Text style={[styles.lede, { color: colors.textMuted }]}>
              Record meals and the insulin dose you took. Everything stays on this device.
            </Text>
            <DisclaimerBanner colors={colors} />
            <AppButton
              label="Log a meal"
              colors={colors}
              accessibilityHint="Opens a form to add a meal and insulin you already took"
              onPress={() => router.push('/log/new')}
            />
            {error ? <ErrorText message={error} colors={colors} /> : null}
            {loading ? <ActivityIndicator size="large" color={colors.primary} /> : null}
            {!loading && logs.length > 0 ? (
              <Text style={[styles.sectionLabel, { color: colors.text }]} accessibilityRole="header">
                Recent logs
              </Text>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No meals logged yet</Text>
              <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
                Tap Log a meal to add foods and the insulin units you entered yourself.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <MealCard log={item} colors={colors} onPress={() => router.push(`/log/${item.id}`)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  header: {
    gap: 14,
    marginBottom: 8,
  },
  title: {
    fontSize: type.title,
    fontWeight: '800',
  },
  lede: {
    fontSize: type.body,
    lineHeight: 24,
  },
  sectionLabel: {
    fontSize: type.subtitle,
    fontWeight: '700',
    marginTop: 8,
  },
  empty: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: type.subtitle,
    fontWeight: '700',
  },
  emptyBody: {
    fontSize: type.body,
    lineHeight: 24,
  },
  separator: {
    height: 12,
  },
});
