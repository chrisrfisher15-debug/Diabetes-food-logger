import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { tapTarget, type, type ThemeColors } from '../theme';

type ButtonProps = {
  label: string;
  onPress: () => void;
  colors: ThemeColors;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  accessibilityHint?: string;
};

export function AppButton({
  label,
  onPress,
  colors,
  variant = 'primary',
  disabled = false,
  accessibilityHint,
}: ButtonProps) {
  const backgroundColor =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : colors.surfaceMuted;
  const textColor =
    variant === 'primary' ? colors.primaryText : variant === 'danger' ? colors.dangerText : colors.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor: variant === 'secondary' ? colors.border : backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
      ]}>
      <Text style={[styles.buttonLabel, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

type FieldProps = {
  label: string;
  colors: ThemeColors;
  value: string;
  onChangeText: (text: string) => void;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & Omit<TextInputProps, 'value' | 'onChangeText'>;

export function TextField({
  label,
  colors,
  value,
  onChangeText,
  hint,
  containerStyle,
  ...inputProps
}: FieldProps) {
  const inputId = label;
  return (
    <View style={containerStyle}>
      <Text nativeID={`${inputId}-label`} style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
      {hint ? <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBg,
            borderColor: colors.border,
            color: colors.text,
          },
          inputProps.multiline ? styles.multiline : null,
        ]}
        {...inputProps}
      />
    </View>
  );
}

export function ScreenSection({
  title,
  children,
  colors,
}: {
  title?: string;
  children: ReactNode;
  colors: ThemeColors;
}) {
  return (
    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {title ? (
        <Text style={[styles.sectionTitle, { color: colors.text }]} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export function ErrorText({ message, colors, style }: { message: string; colors: ThemeColors; style?: StyleProp<TextStyle> }) {
  return (
    <Text accessibilityLiveRegion="polite" style={[styles.error, { color: colors.danger }, style]}>
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: tapTarget,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: type.button,
    fontWeight: '700',
  },
  label: {
    fontSize: type.body,
    fontWeight: '700',
    marginBottom: 4,
  },
  hint: {
    fontSize: type.caption,
    lineHeight: 21,
    marginBottom: 8,
  },
  input: {
    minHeight: tapTarget,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: type.body,
  },
  multiline: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  section: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  sectionTitle: {
    fontSize: type.subtitle,
    fontWeight: '700',
  },
  error: {
    fontSize: type.caption,
    fontWeight: '600',
    lineHeight: 21,
  },
});
