import { createTheme, type PaletteMode } from '@mui/material/styles';
import { breakpoints } from '@theme/tokens/breakpoints';
import { spacing } from '@theme/tokens/spacing';
import { components } from '@theme/mui/components';
import { getPaletteByMode } from '@theme/mui/palette';
import { typography } from '@theme/mui/typography';

export const createAppTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...getPaletteByMode(mode),
    },
    breakpoints,
    spacing,
    typography,
    components,
  });
