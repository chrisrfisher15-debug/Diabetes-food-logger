import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatCarbs, formatDateTime, formatUnits, totalCarbs } from '../format';
import { tapTarget, type, type ThemeColors } from '../theme';
import type { MealLog } from '../types';

export function MealCard({
  log,
  colors,
  onPress,
}: {
  log: MealLog;
  colors: ThemeColors;
  onPress: () => void;
}) {
  const carbs = totalCarbs(log.foods);
  const foodSummary =
    log.foods.length === 0
      ? 'No foods listed'
      : log.foods.length === 1
        ? log.foods[0].name
        : `${log.foods[0].name} + ${log.foods.length - 1} more`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${log.name}, ${formatDateTime(log.timestamp)}, ${formatUnits(log.insulinUnits)} of insulin`}
      accessibilityHint="Opens this meal log so you can view, edit, or delete it"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {log.name}
      </Text>
      <Text style={[styles.time, { color: colors.textMuted }]}>{formatDateTime(log.timestamp)}</Text>
      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: colors.text }]}>Insulin: {formatUnits(log.insulinUnits)}</Text>
        {log.bloodGlucoseMgDl != null ? (
          <Text style={[styles.meta, { color: colors.text }]}>BG: {log.bloodGlucoseMgDl} mg/dL</Text>
        ) : null}
      </View>
      <Text style={[styles.foods, { color: colors.textMuted }]}>
        {foodSummary}
        {carbs != null ? ` · ${formatCarbs(carbs)}` : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: tapTarget,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  title: {
    fontSize: type.subtitle,
    fontWeight: '700',
  },
  time: {
    fontSize: type.caption,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  meta: {
    fontSize: type.body,
    fontWeight: '600',
  },
  foods: {
    fontSize: type.caption,
    lineHeight: 21,
  },
});
