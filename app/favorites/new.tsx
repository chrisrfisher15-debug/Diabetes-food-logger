import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { FavoriteForm } from '../../src/components/FavoriteForm';
import { useFavorites } from '../../src/favorites-context';
import { useThemeColors } from '../../src/theme';
import { createEmptyFavoriteDraft, validateFavoriteDraft } from '../../src/validation';

export default function NewFavoriteScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addFavorite } = useFavorites();

  return (
    <KeyboardAvoidingView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FavoriteForm
          initialDraft={createEmptyFavoriteDraft()}
          submitLabel="Save favorite"
          onSubmit={async (draft) => {
            const result = validateFavoriteDraft(draft);
            if (!result.ok) {
              throw new Error(result.message);
            }
            await addFavorite(result.value);
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/favorites');
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
