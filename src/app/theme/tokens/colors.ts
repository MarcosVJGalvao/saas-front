import type { PaletteMode, PaletteOptions } from '@mui/material/styles';

const lightColors: PaletteOptions = {
  primary: { main: '#0057B8', light: '#3A78C8', dark: '#003C80', contrastText: '#FFFFFF' },
  secondary: { main: '#00A878', light: '#36C39A', dark: '#007A57', contrastText: '#FFFFFF' },
  error: { main: '#C62828', light: '#EF5350', dark: '#8E0000', contrastText: '#FFFFFF' },
  warning: { main: '#ED6C02', light: '#FF9800', dark: '#E65100', contrastText: '#FFFFFF' },
  info: { main: '#0288D1', light: '#29B6F6', dark: '#01579B', contrastText: '#FFFFFF' },
  success: { main: '#2E7D32', light: '#66BB6A', dark: '#1B5E20', contrastText: '#FFFFFF' },
  background: { default: '#F4F7FB', paper: '#FFFFFF' },
  text: { primary: '#0F172A', secondary: '#334155', disabled: '#94A3B8' },
  divider: '#D0D7E2',
};

const darkColors: PaletteOptions = {
  primary: { main: '#7DB3FF', light: '#A9CBFF', dark: '#4D8FEA', contrastText: '#081526' },
  secondary: { main: '#4ED9B4', light: '#7CE8CA', dark: '#1FA284', contrastText: '#052119' },
  error: { main: '#FF6B6B', light: '#FF9A9A', dark: '#D64545', contrastText: '#2C0E0E' },
  warning: { main: '#FFB74D', light: '#FFCC80', dark: '#F57C00', contrastText: '#2D1A05' },
  info: { main: '#4FC3F7', light: '#81D4FA', dark: '#0288D1', contrastText: '#062232' },
  success: { main: '#81C784', light: '#A5D6A7', dark: '#388E3C', contrastText: '#0E2410' },
  background: { default: '#0B1220', paper: '#131D31' },
  text: { primary: '#E5EAF3', secondary: '#A9B4C7', disabled: '#64748B' },
  divider: '#2B3A55',
};

export const getColorTokensByMode = (mode: PaletteMode): PaletteOptions =>
  mode === 'dark' ? darkColors : lightColors;
