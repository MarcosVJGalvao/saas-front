import { useCallback, useState } from 'react';
import type { NavigationItem } from '@shared/types/navigation';
import { ADMIN_NAVIGATION_STORAGE_KEYS } from '@shared/types/adminNavigationStorage';

const readFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(ADMIN_NAVIGATION_STORAGE_KEYS.commandFavorites);
  if (raw === null) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
  } catch {
    return [];
  }
};

export const useCommandPalette = (_items: NavigationItem[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openKey, setOpenKey] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(readFavorites);

  const toggleFavorite = useCallback((itemId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          ADMIN_NAVIGATION_STORAGE_KEYS.commandFavorites,
          JSON.stringify(next),
        );
      }
      return next;
    });
  }, []);

  const open = useCallback(() => {
    setOpenKey((prev) => prev + 1);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, openKey, favorites, open, close, toggleFavorite };
};
