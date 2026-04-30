export type ThemeMode = 'light' | 'dark';

export const THEME_MODE: Record<'LIGHT' | 'DARK', ThemeMode> = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const getNextThemeMode = (currentMode: ThemeMode): ThemeMode =>
  currentMode === THEME_MODE.LIGHT ? THEME_MODE.DARK : THEME_MODE.LIGHT;
