import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MealForm } from '../../src/components/MealForm';
import { AppButton, ErrorText } from '../../src/components/ui';
import { confirmDestructive } from '../../src/confirm';
import { useMealLogs } from '../../src/context';
import { type, useThemeColors } from '../../src/theme';
import { draftFromLog, validateDraft } from '../../src/validation';

export default function EditMealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { getLog, updateLog, deleteLog, loading } = useMealLogs();
  const log = id ? getLog(id) : undefined;

  if (loading && !log) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.textMuted }]}>Loading this meal log…</Text>
      </View>
    );
  }

  if (!log) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ErrorText message="This meal log was not found. It may have been deleted." colors={colors} />
        <AppButton label="Back to history" colors={colors} onPress={() => router.replace('/')} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <MealForm
          key={log.id}
          initialDraft={draftFromLog(log)}
          submitLabel="Save changes"
          onSubmit={async (draft) => {
            const result = validateDraft(draft);
            if (!result.ok) {
              throw new Error(result.message);
            }
          await updateLog(log.id, result.value);
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
          }}
          onDelete={() =>
            confirmDestructive({
              title: 'Delete this meal log?',
              message: 'This removes the meal, foods, and insulin you recorded. It cannot be undone.',
              confirmLabel: 'Delete',
              onConfirm: async () => {
              await deleteLog(log.id);
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
              },
            })
          }
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    fontSize: type.body,
  },
});
