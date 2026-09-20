import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { MealForm } from '../../src/components/MealForm';
import { useMealLogs } from '../../src/context';
import { useThemeColors } from '../../src/theme';
import { createEmptyDraft, validateDraft } from '../../src/validation';

export default function NewMealScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addLog } = useMealLogs();

  return (
    <KeyboardAvoidingView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <MealForm
          initialDraft={createEmptyDraft()}
          submitLabel="Save meal log"
          onSubmit={async (draft) => {
            const result = validateDraft(draft);
            if (!result.ok) {
              throw new Error(result.message);
            }
          await addLog(result.value);
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
          }}
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
});
