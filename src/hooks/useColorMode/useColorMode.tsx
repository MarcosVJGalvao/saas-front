import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { ADMIN_NAVIGATION_STORAGE_KEYS } from '../../models/adminNavigationStorage';
import { getNextThemeMode, THEME_MODE, type ThemeMode } from '../../models/themeMode';
import { getTheme } from '../../theme/theme';

interface ColorModeContextValue {
  mode: ThemeMode;
  toggleColorMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

const readThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return THEME_MODE.LIGHT;
  }

  const rawValue = window.localStorage.getItem(ADMIN_NAVIGATION_STORAGE_KEYS.theme);
  return rawValue === THEME_MODE.DARK ? THEME_MODE.DARK : THEME_MODE.LIGHT;
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
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

  const theme = useMemo(() => getTheme(mode), [mode]);
  const value = useMemo(
    () => ({ mode, toggleColorMode, setMode }),
    [mode, setMode, toggleColorMode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = (): ColorModeContextValue => {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error('useColorMode deve ser usado dentro de AppThemeProvider.');
  }
  return context;
};
