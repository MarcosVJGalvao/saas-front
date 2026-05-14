import type { PaletteMode } from '@mui/material/styles';
import { createAppTheme } from '@theme/mui/createAppTheme';

export const getTheme = (mode: PaletteMode) => createAppTheme(mode);
