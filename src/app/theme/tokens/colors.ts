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
  primary: { main: '#4F8CFF', light: '#78A7FF', dark: '#346DDA', contrastText: '#F7FAFF' },
  secondary: { main: '#6C7DFF', light: '#8E99FF', dark: '#5361DB', contrastText: '#F7F8FF' },
  error: { main: '#E77777', light: '#F2A0A0', dark: '#C85A5A', contrastText: '#FFF7F7' },
  warning: { main: '#D3A65E', light: '#E3BF84', dark: '#B08543', contrastText: '#FFF9F0' },
  info: { main: '#5C90F5', light: '#82AAFF', dark: '#4473D7', contrastText: '#F8FAFF' },
  success: { main: '#6FB38D', light: '#92CAAA', dark: '#51896C', contrastText: '#F6FCF8' },
  background: { default: '#151515', paper: '#202020' },
  text: { primary: '#F5F5F5', secondary: '#B5B5B5', disabled: '#7B7B7B' },
  divider: '#313131',
};

export const getColorTokensByMode = (mode: PaletteMode): PaletteOptions =>
  mode === 'dark' ? darkColors : lightColors;
