import type { PaletteMode, PaletteOptions } from '@mui/material/styles';
import { getColorTokensByMode } from '@theme/tokens/colors';

export const getPaletteByMode = (mode: PaletteMode): PaletteOptions => getColorTokensByMode(mode);
