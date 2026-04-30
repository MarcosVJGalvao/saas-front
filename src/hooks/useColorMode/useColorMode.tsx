import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '../../theme/theme';
import { getNextThemeMode, THEME_MODE, type ThemeMode } from '../../models/themeMode';

interface ColorModeContextValue {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(THEME_MODE.LIGHT);

  const toggleColorMode = () => {
    setMode((previousMode) => getNextThemeMode(previousMode));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleColorMode }), [mode]);

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
