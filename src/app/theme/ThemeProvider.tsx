import type { ReactNode } from 'react';
import { useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createAppTheme } from '@theme/mui/createAppTheme';
import { ThemeModeContext, useThemeModeState } from '@theme/useThemeMode';

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const themeMode = useThemeModeState();
  const theme = useMemo(() => createAppTheme(themeMode.mode), [themeMode.mode]);

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
