import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FavoriteForm } from '../../src/components/FavoriteForm';
import { AppButton, ErrorText } from '../../src/components/ui';
import { confirmDestructive } from '../../src/confirm';
import { useFavorites } from '../../src/favorites-context';
import { type, useThemeColors } from '../../src/theme';
import { draftFromFavorite, validateFavoriteDraft } from '../../src/validation';

export default function EditFavoriteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { getFavorite, updateFavorite, deleteFavorite, loading } = useFavorites();
  const favorite = id ? getFavorite(id) : undefined;

  if (loading && !favorite) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.message, { color: colors.textMuted }]}>Loading this favorite…</Text>
      </View>
    );
  }

  if (!favorite) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ErrorText message="This favorite was not found. It may have been deleted." colors={colors} />
        <AppButton label="Back to favorites" colors={colors} onPress={() => router.replace('/favorites')} />
      </View>
    );
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/favorites');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FavoriteForm
          key={favorite.id}
          initialDraft={draftFromFavorite(favorite)}
          submitLabel="Save favorite"
          onSubmit={async (draft) => {
            const result = validateFavoriteDraft(draft);
            if (!result.ok) {
              throw new Error(result.message);
            }
            await updateFavorite(favorite.id, result.value);
            goBack();
          }}
          onDelete={() =>
            confirmDestructive({
              title: 'Delete this favorite?',
              message: 'This removes the saved reminder. Existing meal logs are not changed.',
              confirmLabel: 'Delete',
              onConfirm: async () => {
                await deleteFavorite(favorite.id);
                goBack();
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
