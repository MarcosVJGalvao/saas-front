import type { PaletteMode } from '@mui/material/styles';

export interface UiColorTokens {
  heroGradient: string;
  heroAccent: string;
  heroLine: string;
  heroCardBackground: string;
  topBarAvatarGradient: string;
  menuBackdrop: string;
  menuBorder: string;
  menuShadow: string;
  menuDivider: string;
  notificationInfoBg: string;
  notificationInfoColor: string;
  notificationSuccessBg: string;
  notificationSuccessColor: string;
  notificationWarningBg: string;
  notificationWarningColor: string;
  notificationPrimaryBg: string;
  notificationPrimaryColor: string;
  notificationSecondaryBg: string;
  notificationSecondaryColor: string;
  statusActiveBg: string;
  statusActiveColor: string;
  statusNeutralBg: string;
  statusNeutralColor: string;
}

const lightTokens: UiColorTokens = {
  heroGradient: 'linear-gradient(180deg,#041b57 0%,#0038b7 100%)',
  heroAccent: '#2e7cff',
  heroLine: '#1b7fff',
  heroCardBackground: 'rgba(31,114,255,.25)',
  topBarAvatarGradient: 'linear-gradient(135deg, #5B6CFF 0%, #6C4BFF 100%)',
  menuBackdrop: 'rgba(255,255,255,0.96)',
  menuBorder: 'rgba(27,127,255,0.16)',
  menuShadow: '0 20px 60px rgba(0,0,0,0.24)',
  menuDivider: 'rgba(27,127,255,0.16)',
  notificationInfoBg: 'rgba(99,102,241,0.14)',
  notificationInfoColor: '#6366F1',
  notificationSuccessBg: 'rgba(34,197,94,0.14)',
  notificationSuccessColor: '#16A34A',
  notificationWarningBg: 'rgba(245,158,11,0.16)',
  notificationWarningColor: '#D97706',
  notificationPrimaryBg: 'rgba(59,130,246,0.14)',
  notificationPrimaryColor: '#2563EB',
  notificationSecondaryBg: 'rgba(139,92,246,0.14)',
  notificationSecondaryColor: '#7C3AED',
  statusActiveBg: '#DFF3E5',
  statusActiveColor: '#1B7F3A',
  statusNeutralBg: '#EEF1F4',
  statusNeutralColor: '#5B6570',
};

const darkTokens: UiColorTokens = {
  heroGradient: 'linear-gradient(180deg,#041b57 0%,#0038b7 100%)',
  heroAccent: '#7DA3FF',
  heroLine: '#5A8DFF',
  heroCardBackground: 'rgba(90,141,255,0.18)',
  topBarAvatarGradient: 'linear-gradient(135deg, #4378E8 0%, #6A8CFF 100%)',
  menuBackdrop: 'rgba(30,30,30,0.96)',
  menuBorder: 'rgba(94,142,255,0.16)',
  menuShadow: '0 24px 64px rgba(0,0,0,0.52)',
  menuDivider: 'rgba(255,255,255,0.08)',
  notificationInfoBg: 'rgba(92,144,245,0.18)',
  notificationInfoColor: '#A9C5FF',
  notificationSuccessBg: 'rgba(111,179,141,0.18)',
  notificationSuccessColor: '#AFDCC0',
  notificationWarningBg: 'rgba(211,166,94,0.18)',
  notificationWarningColor: '#E5C791',
  notificationPrimaryBg: 'rgba(79,140,255,0.2)',
  notificationPrimaryColor: '#B7D0FF',
  notificationSecondaryBg: 'rgba(108,125,255,0.18)',
  notificationSecondaryColor: '#C0CAFF',
  statusActiveBg: '#24362E',
  statusActiveColor: '#A7D8BA',
  statusNeutralBg: '#2B2B2B',
  statusNeutralColor: '#D0D0D0',
};

export const getUiColorTokens = (mode: PaletteMode): UiColorTokens =>
  mode === 'dark' ? darkTokens : lightTokens;
