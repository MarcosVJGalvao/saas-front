export type DensityMode = 'compact' | 'normal' | 'wide';

export const DENSITY_MODE: Record<'COMPACT' | 'NORMAL' | 'WIDE', DensityMode> = {
  COMPACT: 'compact',
  NORMAL: 'normal',
  WIDE: 'wide',
};

export interface DensityMetrics {
  sidebarItemHeight: number;
  submenuItemHeight: number;
  appBarHeight: number;
}

export const densityMetrics: Record<DensityMode, DensityMetrics> = {
  compact: {
    sidebarItemHeight: 42,
    submenuItemHeight: 36,
    appBarHeight: 64,
  },
  normal: {
    sidebarItemHeight: 48,
    submenuItemHeight: 40,
    appBarHeight: 72,
  },
  wide: {
    sidebarItemHeight: 56,
    submenuItemHeight: 44,
    appBarHeight: 80,
  },
};
