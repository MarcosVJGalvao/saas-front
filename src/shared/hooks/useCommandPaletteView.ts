import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NavigationItem, SearchScope } from '@shared/types/navigation';

const flattenItems = (items: NavigationItem[]): NavigationItem[] =>
  items.flatMap((item) => [item, ...flattenItems(item.children ?? [])]);

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

const buildItemSectionMap = (items: NavigationItem[]): Map<string, string> => {
  const map = new Map<string, string>();
  let currentSectionId = '';
  for (const item of flattenItems(items)) {
    if (item.type === 'section') {
      currentSectionId = item.id;
    } else {
      map.set(item.id, currentSectionId);
    }
  }
  return map;
};

const buildSectionLabelMap = (items: NavigationItem[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const item of flattenItems(items)) {
    if (item.type === 'section') map.set(item.id, item.label);
  }
  return map;
};

const buildSearchScopes = (items: NavigationItem[]): SearchScope[] => {
  const flat = flattenItems(items);
  const scopes: SearchScope[] = [];
  let currentSectionId = '';

  for (const item of flat) {
    if (item.type === 'section') {
      currentSectionId = item.id;
      continue;
    }
    if (item.href !== undefined) {
      scopes.push({ id: currentSectionId, label: item.label, route: item.href });
    }
    if (item.searchScopes) {
      scopes.push(...item.searchScopes.map((scope) => ({ ...scope, id: currentSectionId })));
    }
  }

  return scopes;
};

interface FlatItemWithNormalizedLabel {
  item: NavigationItem;
  normalizedSearchValues: string[];
}

export const useCommandPaletteView = (
  query: string,
  filterQuery: string,
  favorites: string[],
  items: NavigationItem[],
  onClose: () => void,
) => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('all');

  const flatItems = useMemo(
    () => flattenItems(items).filter((item) => item.type !== 'section'),
    [items],
  );

  // Pre-normalize labels once per items change, not on every keystroke
  const flatItemsWithNormalized = useMemo<FlatItemWithNormalizedLabel[]>(
    () =>
      flatItems.map((item) => ({
        item,
        normalizedSearchValues: [item.label, ...(item.keywords ?? [])].map(normalizeText),
      })),
    [flatItems],
  );

  const itemSectionMap = useMemo(() => buildItemSectionMap(items), [items]);
  const sectionLabelMap = useMemo(() => buildSectionLabelMap(items), [items]);

  const getSectionLabel = useCallback(
    (itemId: string): string => {
      const sectionId = itemSectionMap.get(itemId) ?? '';
      return sectionLabelMap.get(sectionId) ?? '';
    },
    [itemSectionMap, sectionLabelMap],
  );

  const tabItems = useMemo(
    () => [
      { key: 'all', label: 'Tudo' },
      ...flattenItems(items)
        .filter((item) => item.type === 'section')
        .map((item) => ({ key: item.id, label: item.label })),
    ],
    [items],
  );

  const allFavoritesItems = useMemo(
    () => flatItems.filter((item) => favorites.includes(item.id)).slice(0, 6),
    [favorites, flatItems],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeText(filterQuery.trim());
    return flatItemsWithNormalized
      .filter(({ item, normalizedSearchValues }) => {
        const tabMatch = activeTab === 'all' || itemSectionMap.get(item.id) === activeTab;
        if (normalizedQuery.length === 0) return tabMatch;
        return tabMatch && normalizedSearchValues.some((val) => val.includes(normalizedQuery));
      })
      .map(({ item }) => item);
  }, [activeTab, filterQuery, flatItemsWithNormalized, itemSectionMap]);

  const favoritesItems = useMemo(
    () => filteredItems.filter((item) => favorites.includes(item.id)).slice(0, 4),
    [favorites, filteredItems],
  );

  const matchedItems = useMemo(
    () => filteredItems.filter((item) => !favorites.includes(item.id)).slice(0, 8),
    [favorites, filteredItems],
  );

  const allSearchScopes = useMemo(() => buildSearchScopes(items), [items]);

  const searchScopes = useMemo(() => {
    if (filterQuery.trim().length === 0) return [];
    if (activeTab === 'all') return allSearchScopes;
    return allSearchScopes.filter((scope) => scope.id === activeTab);
  }, [activeTab, allSearchScopes, filterQuery]);

  const selectItem = useCallback(
    (item: NavigationItem) => {
      if (item.href !== undefined) {
        void navigate(item.href);
        onClose();
      }
    },
    [navigate, onClose],
  );

  const selectScope = useCallback(
    (scope: SearchScope) => {
      void navigate(scope.route, { state: { search: query.trim() } });
      onClose();
    },
    [navigate, onClose, query],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, Math.max(filteredItems.length - 1, 0)));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
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
    matchedItems,
    allFavoritesItems,
    searchScopes,
    getSectionLabel,
    selectItem,
    selectScope,
    onKeyDown,
  };
};
