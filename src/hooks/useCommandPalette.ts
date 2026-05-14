import { useCallback, useMemo, useState } from 'react';
import type { NavigationItem } from '@models/navigation';
import { ADMIN_NAVIGATION_STORAGE_KEYS } from '@models/adminNavigationStorage';

const readFavorites = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const rawValue = window.localStorage.getItem(ADMIN_NAVIGATION_STORAGE_KEYS.commandFavorites);
  if (rawValue === null) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    if (Array.isArray(parsedValue) && parsedValue.every((item) => typeof item === 'string')) {
      return parsedValue;
    }
    return [];
  } catch {
    return [];
  }
};

const flattenItems = (items: NavigationItem[]): NavigationItem[] =>
  items.flatMap((item) => [item, ...(item.children ?? [])]);

export const useCommandPalette = (items: NavigationItem[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(readFavorites);

  const allItems = useMemo(() => flattenItems(items), [items]);
  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      return allItems;
    }

    return allItems.filter((item) => {
      const searchableValues = [item.label, ...(item.keywords ?? [])].map((value) =>
        value.toLowerCase(),
      );
      return searchableValues.some((value) => value.includes(normalizedQuery));
    });
  }, [allItems, query]);

  const toggleFavorite = useCallback((itemId: string) => {
    setFavorites((previousState) => {
      const nextState = previousState.includes(itemId)
        ? previousState.filter((favoriteId) => favoriteId !== itemId)
        : [...previousState, itemId];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          ADMIN_NAVIGATION_STORAGE_KEYS.commandFavorites,
          JSON.stringify(nextState),
        );
      }
      return nextState;
    });
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    query,
    favorites,
    filteredItems,
    open,
    close,
    setQuery,
    toggleFavorite,
  };
};
