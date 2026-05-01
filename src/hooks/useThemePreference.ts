import { useColorMode } from './useColorMode/useColorMode';
import { THEME_MODE } from '../models/themeMode';

export const useThemePreference = () => {
  const { mode, setMode } = useColorMode();
  return {
    theme: mode,
    isDark: mode === THEME_MODE.DARK,
    setTheme: setMode,
  };
};
