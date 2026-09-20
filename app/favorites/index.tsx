import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, ErrorText } from '../../src/components/ui';
import { useFavorites } from '../../src/favorites-context';
import { formatCarbs, formatUnits } from '../../src/format';
import { type, useThemeColors } from '../../src/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { favorites, loading, error } = useFavorites();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.lede, { color: colors.textMuted }]}>
              Save foods you eat often and the insulin amount you usually type. Favorites only prefill
              a meal log. They are not dose recommendations and are not linked to a pump or CGM.
            </Text>
            <AppButton
              label="Add a favorite"
              colors={colors}
              onPress={() => router.push('/favorites/new')}
            />
            {error ? <ErrorText message={error} colors={colors} /> : null}
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No favorites yet</Text>
              <Text style={[styles.emptyBody, { color: colors.textMuted }]}>
                Add a food and the insulin units you want to remember. You can tap it later when you
                log a meal.
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <AppButton
            label={`${item.name} · ${formatUnits(item.insulinUnits)}${
              item.carbsGrams != null ? ` · ${formatCarbs(item.carbsGrams)}` : ''
            }`}
            variant="secondary"
            colors={colors}
            accessibilityHint="Opens this favorite so you can edit or delete it"
            onPress={() => router.push(`/favorites/${item.id}`)}
          />
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
  lede: {
    fontSize: type.body,
    lineHeight: 24,
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
