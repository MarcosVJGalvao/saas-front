import { useCallback, useState } from 'react';
import { DENSITY_MODE, type DensityMode } from '@shared/types/density';
import { ADMIN_NAVIGATION_STORAGE_KEYS } from '@shared/types/adminNavigationStorage';

const isDensityMode = (value: string): value is DensityMode =>
  value === DENSITY_MODE.COMPACT || value === DENSITY_MODE.NORMAL || value === DENSITY_MODE.WIDE;

const readDensity = (): DensityMode => {
  if (typeof window === 'undefined') {
    return DENSITY_MODE.NORMAL;
  }

  const rawValue = window.localStorage.getItem(ADMIN_NAVIGATION_STORAGE_KEYS.density);
  return rawValue !== null && isDensityMode(rawValue) ? rawValue : DENSITY_MODE.NORMAL;
};

export const useDensityPreference = () => {
  const [density, setDensity] = useState<DensityMode>(readDensity);

  const updateDensity = useCallback((nextDensity: DensityMode) => {
    setDensity(nextDensity);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_NAVIGATION_STORAGE_KEYS.density, nextDensity);
    }
  }, []);

  return { density, setDensity: updateDensity };
};
