import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ADMIN_NAVIGATION_STORAGE_KEYS } from '@models/adminNavigationStorage';
import { getNextThemeMode, THEME_MODE, type ThemeMode } from '@models/themeMode';

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleColorMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export const readThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return THEME_MODE.LIGHT;
  }

  const rawValue = window.localStorage.getItem(ADMIN_NAVIGATION_STORAGE_KEYS.theme);
  return rawValue === THEME_MODE.DARK ? THEME_MODE.DARK : THEME_MODE.LIGHT;
};

export const useThemeModeState = (): ThemeModeContextValue => {
  const [mode, setModeState] = useState<ThemeMode>(readThemeMode);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_NAVIGATION_STORAGE_KEYS.theme, nextMode);
    }
  }, []);

  const toggleColorMode = useCallback(() => {
    const nextMode = getNextThemeMode(mode);
    setMode(nextMode);
  }, [mode, setMode]);

  return useMemo(() => ({ mode, toggleColorMode, setMode }), [mode, setMode, toggleColorMode]);
};

export const useThemeMode = (): ThemeModeContextValue => {
  const context = useContext(ThemeModeContext);
  if (context === undefined) {
    throw new Error('useThemeMode deve ser usado dentro de AppThemeProvider.');
  }
  return context;
};
