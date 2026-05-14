import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavigationItem } from '@models/navigation';

const flattenItems = (items: NavigationItem[]): NavigationItem[] =>
  items.flatMap((item) => [item, ...(item.children ?? [])]);

export const useCommandPaletteView = (
  query: string,
  favorites: string[],
  items: NavigationItem[],
  onClose: () => void,
) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const flatItems = useMemo(() => flattenItems(items), [items]);
  const tabItems = useMemo(
    () => [
      { key: 'all', label: 'Tudo' },
      ...items.map((item) => ({ key: item.id, label: item.label })),
    ],
    [items],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    return flatItems.filter((item) => {
      const tabMatch = activeTab === 'all' || item.id.includes(activeTab);
      const queryMatch = item.label.toLowerCase().includes(normalizedQuery);
      return tabMatch && queryMatch;
    });
  }, [activeTab, flatItems, query]);

  const favoritesItems = useMemo(
    () => filteredItems.filter((item) => favorites.includes(item.id)).slice(0, 4),
    [favorites, filteredItems],
  );

  const suggestionItems = useMemo(
    () => filteredItems.filter((item) => !favorites.includes(item.id)).slice(0, 5),
    [favorites, filteredItems],
  );

  const selectItem = useCallback(
    (item: NavigationItem) => {
      if (item.href !== undefined) {
        void navigate(item.href);
        onClose();
      }
    },
    [navigate, onClose],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((currentIndex) =>
          Math.min(currentIndex + 1, Math.max(filteredItems.length - 1, 0)),
        );
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((currentIndex) => Math.max(currentIndex - 1, 0));
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const selectedItem = filteredItems[activeIndex];
        if (selectedItem !== undefined) selectItem(selectedItem);
      }
    },
    [activeIndex, filteredItems, onClose, selectItem],
  );

  return {
    activeTab,
    setActiveTab,
    tabItems,
    filteredItems,
    favoritesItems,
    suggestionItems,
    selectItem,
    onKeyDown,
  };
};
