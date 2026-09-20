import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../theme';
import type { FavoriteDraft } from '../types';
import { validateFavoriteDraft } from '../validation';
import { DisclaimerBanner } from './DisclaimerBanner';
import { AppButton, ErrorText, ScreenSection, TextField } from './ui';

type FavoriteFormProps = {
  initialDraft: FavoriteDraft;
  submitLabel: string;
  onSubmit: (draft: FavoriteDraft) => Promise<void>;
  onDelete?: () => void;
};

export function FavoriteForm({ initialDraft, submitLabel, onSubmit, onDelete }: FavoriteFormProps) {
  const colors = useThemeColors();
  const [draft, setDraft] = useState<FavoriteDraft>(initialDraft);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const result = validateFavoriteDraft(draft);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(draft);
    } catch {
      setError('Could not save this favorite on the device. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <DisclaimerBanner colors={colors} />
      <ScreenSection title="Personal reminder" colors={colors}>
        <Text style={[styles.note, { color: colors.textMuted }]}>
          Save a food you eat often and the insulin amount you usually enter for it. This is only a
          prefill shortcut. It is not a recommended dose and is not connected to a pump or CGM.
        </Text>
        <TextField
          label="Food or meal name"
          colors={colors}
          value={draft.name}
          onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
          autoCapitalize="sentences"
        />
        <TextField
          label="Carbs (grams, optional)"
          colors={colors}
          value={draft.carbsText}
          onChangeText={(carbsText) => setDraft((current) => ({ ...current, carbsText }))}
          keyboardType="decimal-pad"
        />
        <TextField
          label="Insulin you usually enter (units)"
          hint="Type the amount you want to remember. This app never calculates a dose."
          colors={colors}
          value={draft.insulinUnitsText}
          onChangeText={(insulinUnitsText) => setDraft((current) => ({ ...current, insulinUnitsText }))}
          keyboardType="decimal-pad"
        />
      </ScreenSection>
      {error ? <ErrorText message={error} colors={colors} /> : null}
      <AppButton label={saving ? 'Saving…' : submitLabel} colors={colors} disabled={saving} onPress={handleSave} />
      {onDelete ? <AppButton label="Delete favorite" variant="danger" colors={colors} onPress={onDelete} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
    paddingBottom: 40,
  },
  note: {
    fontSize: 15,
    lineHeight: 21,
  },
});
