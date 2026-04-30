import { createTheme, type PaletteMode } from '@mui/material/styles';
import { breakpoints } from './breakpoints';
import { getPaletteByMode } from './palette';
import { spacing } from './spacing';
import { typography } from './typography';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...getPaletteByMode(mode),
    },
    breakpoints,
    spacing,
    typography,
    components: {
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            h1: 'h1',
            h2: 'h2',
            h3: 'h3',
            h4: 'h4',
            h5: 'h5',
            h6: 'h6',
            subtitle1: 'p',
            subtitle2: 'p',
            body1: 'p',
            body2: 'p',
          },
        },
      },
    },
  });
