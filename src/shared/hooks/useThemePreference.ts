import { useColorMode } from '@shared/hooks/useColorMode/useColorMode';
import { THEME_MODE } from '@shared/types/themeMode';

export const useThemePreference = () => {
  const { mode, setMode } = useColorMode();
  return {
    theme: mode,
    isDark: mode === THEME_MODE.DARK,
    setTheme: setMode,
  };
};
