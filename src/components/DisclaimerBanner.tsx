import { StyleSheet, Text, View } from 'react-native';

import { type, type ThemeColors } from '../theme';

export const DISCLAIMER_TEXT =
  'For personal logging only. This is not a medical device and not medical advice. It does not recommend insulin doses. Follow your clinician’s plan.';

export function DisclaimerBanner({ colors }: { colors: ThemeColors }) {
  return (
    <View
      accessibilityRole="summary"
      accessibilityLabel={DISCLAIMER_TEXT}
      style={[styles.banner, { backgroundColor: colors.warningBg, borderColor: colors.warningBorder }]}>
      <Text style={[styles.kicker, { color: colors.warningText }]}>Not medical advice</Text>
      <Text style={[styles.body, { color: colors.warningText }]}>{DISCLAIMER_TEXT}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  body: {
    fontSize: type.caption,
    lineHeight: 22,
    fontWeight: '600',
  },
});
