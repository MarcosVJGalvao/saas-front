import type { PaletteMode } from '@mui/material/styles';

export interface UiColorTokens {
  heroGradient: string;
  heroAccent: string;
  heroLine: string;
  heroCardBackground: string;
}

const lightTokens: UiColorTokens = {
  heroGradient: 'linear-gradient(180deg,#041b57 0%,#0038b7 100%)',
  heroAccent: '#2e7cff',
  heroLine: '#1b7fff',
  heroCardBackground: 'rgba(31,114,255,.25)',
};

const darkTokens: UiColorTokens = {
  heroGradient: 'linear-gradient(180deg,#081526 0%,#0d2e6b 100%)',
  heroAccent: '#7db3ff',
  heroLine: '#4d8fea',
  heroCardBackground: 'rgba(125,179,255,.22)',
};

export const getUiColorTokens = (mode: PaletteMode): UiColorTokens =>
  mode === 'dark' ? darkTokens : lightTokens;
