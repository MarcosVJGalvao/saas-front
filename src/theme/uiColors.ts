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
};

const darkTokens: UiColorTokens = {
  heroGradient: 'linear-gradient(180deg,#081526 0%,#0d2e6b 100%)',
  heroAccent: '#7db3ff',
  heroLine: '#4d8fea',
  heroCardBackground: 'rgba(125,179,255,.22)',
  topBarAvatarGradient: 'linear-gradient(135deg, #5B6CFF 0%, #6C4BFF 100%)',
  menuBackdrop: 'rgba(8,16,30,0.94)',
  menuBorder: 'rgba(125,179,255,0.18)',
  menuShadow: '0 24px 60px rgba(1,8,22,0.58)',
  menuDivider: 'rgba(125,179,255,0.16)',
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
};

export const getUiColorTokens = (mode: PaletteMode): UiColorTokens =>
  mode === 'dark' ? darkTokens : lightTokens;
