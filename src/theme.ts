import { useColorScheme } from 'react-native';

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  danger: string;
  dangerText: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  inputBg: string;
};

export const lightColors: ThemeColors = {
  background: '#F3F6F4',
  surface: '#FFFFFF',
  surfaceMuted: '#E7EEE9',
  text: '#14241B',
  textMuted: '#3E5348',
  border: '#C5D2CA',
  primary: '#0B6B4A',
  primaryText: '#FFFFFF',
  danger: '#9B1D2C',
  dangerText: '#FFFFFF',
  warningBg: '#FFF4D4',
  warningBorder: '#C49214',
  warningText: '#4A3700',
  inputBg: '#F8FBFA',
};

export const darkColors: ThemeColors = {
  background: '#0E1612',
  surface: '#18241E',
  surfaceMuted: '#223129',
  text: '#F2F7F4',
  textMuted: '#B7C6BD',
  border: '#33463C',
  primary: '#3DDBA3',
  primaryText: '#082116',
  danger: '#FF8A96',
  dangerText: '#3A0810',
  warningBg: '#3A2E0C',
  warningBorder: '#D7B045',
  warningText: '#FFE9A8',
  inputBg: '#121C17',
};

export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
}

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
};

export const type = {
  title: 28,
  subtitle: 20,
  body: 17,
  caption: 15,
  button: 18,
};

export const tapTarget = 48;
