import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useFavorites } from '../favorites-context';
import { combineDateAndTime, formatCarbs, formatDateInput, formatTimeInput, formatUnits } from '../format';
import { useThemeColors } from '../theme';
import type { MealLogDraft } from '../types';
import { applyFavoriteToDraft, createEmptyFood, validateDraft } from '../validation';
import { DisclaimerBanner } from './DisclaimerBanner';
import { AppButton, ErrorText, ScreenSection, TextField } from './ui';

type MealFormProps = {
  initialDraft: MealLogDraft;
  submitLabel: string;
  onSubmit: (draft: MealLogDraft) => Promise<void>;
  onDelete?: () => void;
};

export function MealForm({ initialDraft, submitLabel, onSubmit, onDelete }: MealFormProps) {
  const colors = useThemeColors();
  const router = useRouter();
  const { favorites } = useFavorites();
  const [draft, setDraft] = useState<MealLogDraft>(initialDraft);
  const [prefillNote, setPrefillNote] = useState<string | null>(null);
  const [dateText, setDateText] = useState(formatDateInput(initialDraft.timestamp));
  const [timeText, setTimeText] = useState(formatTimeInput(initialDraft.timestamp));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateTimestamp = (nextDate: string, nextTime: string) => {
    setDateText(nextDate);
    setTimeText(nextTime);
    setDraft((current) => ({
      ...current,
      timestamp: combineDateAndTime(nextDate, nextTime, current.timestamp),
    }));
  };

  const handleSave = async () => {
    const result = validateDraft(draft);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSubmit(draft);
    } catch {
      setError('Could not save this log on the device. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.form}>
      <DisclaimerBanner colors={colors} />

      <ScreenSection title="Prefill from a favorite" colors={colors}>
        <Text style={[styles.helper, { color: colors.textMuted }]}>
          Personal reminders only. Tapping a favorite copies name, carbs, and insulin into this form
          as a starting point. It is not a dose recommendation and is not connected to a pump or CGM.
          Edit the insulin field before you save if today’s dose is different.
        </Text>
        {favorites.length === 0 ? (
          <AppButton
            label="Save a favorite food"
            variant="secondary"
            colors={colors}
            accessibilityHint="Opens favorites so you can save a personal reminder"
            onPress={() => router.push('/favorites/new')}
          />
        ) : (
          favorites.map((favorite) => (
            <AppButton
              key={favorite.id}
              label={`${favorite.name} · ${formatUnits(favorite.insulinUnits)}${
                favorite.carbsGrams != null ? ` · ${formatCarbs(favorite.carbsGrams)}` : ''
              }`}
              variant="secondary"
              colors={colors}
              accessibilityHint="Copies this favorite into the form as a starting point you can edit"
              onPress={() => {
                setDraft((current) => applyFavoriteToDraft(current, favorite));
                setPrefillNote(
                  `Prefilled from “${favorite.name}”. This is your saved reminder, not a recommended dose. Change the insulin field if today’s dose is different, then save.`
                );
                setError(null);
              }}
            />
          ))
        )}
        {prefillNote ? <Text style={[styles.helper, { color: colors.text }]}>{prefillNote}</Text> : null}
      </ScreenSection>

      <ScreenSection title="Meal" colors={colors}>
        <TextField
          label="Meal name or notes"
          hint="Example: Lunch at home, or pasta with salad"
          colors={colors}
          value={draft.name}
          onChangeText={(name) => setDraft((current) => ({ ...current, name }))}
          autoCapitalize="sentences"
        />
      </ScreenSection>

      <ScreenSection title="Foods" colors={colors}>
        <Text style={[styles.helper, { color: colors.textMuted }]}>
          Add what you ate. Carbs in grams are optional and only stored as you type them.
        </Text>
        {draft.foods.map((food, index) => (
          <View key={food.id} style={[styles.foodRow, { borderColor: colors.border }]}>
            <TextField
              label={`Food ${index + 1} name`}
              colors={colors}
              value={food.name}
              onChangeText={(name) =>
                setDraft((current) => ({
                  ...current,
                  foods: current.foods.map((item) => (item.id === food.id ? { ...item, name } : item)),
                }))
              }
            />
            <TextField
              label="Carbs (grams, optional)"
              colors={colors}
              value={food.carbsText}
              onChangeText={(carbsText) =>
                setDraft((current) => ({
                  ...current,
                  foods: current.foods.map((item) => (item.id === food.id ? { ...item, carbsText } : item)),
                }))
              }
              keyboardType="decimal-pad"
            />
            {draft.foods.length > 1 ? (
              <AppButton
                label="Remove food"
                variant="secondary"
                colors={colors}
                onPress={() =>
                  setDraft((current) => ({
                    ...current,
                    foods: current.foods.filter((item) => item.id !== food.id),
                  }))
                }
              />
            ) : null}
          </View>
        ))}
        <AppButton
          label="Add food"
          variant="secondary"
          colors={colors}
          onPress={() => setDraft((current) => ({ ...current, foods: [...current.foods, createEmptyFood()] }))}
        />
      </ScreenSection>

      <ScreenSection title="Insulin you took" colors={colors}>
        <TextField
          label="Insulin dose (units)"
          hint="Enter the dose you already took. This app never calculates or recommends a dose."
          colors={colors}
          value={draft.insulinUnitsText}
          onChangeText={(insulinUnitsText) => setDraft((current) => ({ ...current, insulinUnitsText }))}
          keyboardType="decimal-pad"
        />
      </ScreenSection>

      <ScreenSection title="Optional details" colors={colors}>
        <TextField
          label="Blood glucose (mg/dL, optional)"
          colors={colors}
          value={draft.bloodGlucoseText}
          onChangeText={(bloodGlucoseText) => setDraft((current) => ({ ...current, bloodGlucoseText }))}
          keyboardType="decimal-pad"
        />
        <TextField
          label="Date (YYYY-MM-DD)"
          colors={colors}
          value={dateText}
          onChangeText={(next) => updateTimestamp(next, timeText)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextField
          label="Time (HH:MM, 24-hour)"
          colors={colors}
          value={timeText}
          onChangeText={(next) => updateTimestamp(dateText, next)}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <AppButton
          label="Use current date and time"
          variant="secondary"
          colors={colors}
          onPress={() => {
            const now = new Date();
            setDraft((current) => ({ ...current, timestamp: now }));
            setDateText(formatDateInput(now));
            setTimeText(formatTimeInput(now));
          }}
        />
      </ScreenSection>

      {error ? <ErrorText message={error} colors={colors} /> : null}

      <AppButton label={saving ? 'Saving…' : submitLabel} colors={colors} disabled={saving} onPress={handleSave} />
      {onDelete ? <AppButton label="Delete this log" variant="danger" colors={colors} onPress={onDelete} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
    paddingBottom: 40,
  },
  helper: {
    fontSize: 15,
    lineHeight: 21,
  },
  foodRow: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
});
