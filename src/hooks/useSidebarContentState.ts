import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigationItem } from '../models/navigation';

export interface SidebarChildItem extends NavigationItem {
  isActive: boolean;
}

export interface SidebarMappedItem extends NavigationItem {
  hasChildren: boolean;
  isActive: boolean;
  isOpen: boolean;
  children?: SidebarChildItem[];
}

interface SidebarContentStateResult {
  mappedItems: SidebarMappedItem[];
  toggleGroup: (itemId: string) => void;
  onItemClick: (href?: string) => void;
}

export const useSidebarContentState = (
  items: NavigationItem[],
  closeMobile?: () => void,
): SidebarContentStateResult => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ usuarios: true });

  const onItemClick = useCallback(
    (href?: string) => {
      if (href !== undefined) {
        void navigate(href);
        closeMobile?.();
      }
    },
    [closeMobile, navigate],
  );

  const isItemActive = useCallback(
    (href?: string) => (href !== undefined ? location.pathname.startsWith(href) : false),
    [location.pathname],
  );

  const toggleGroup = useCallback((itemId: string) => {
    setOpenGroups((previousState) => ({
      ...previousState,
      [itemId]: !previousState[itemId],
    }));
  }, []);

  const mappedItems = useMemo<SidebarMappedItem[]>(
    () =>
      items.map((item) => {
        const hasChildren = (item.children?.length ?? 0) > 0;
        const mappedChildren = item.children?.map(
          (child): SidebarChildItem => ({
            ...child,
            isActive: isItemActive(child.href),
          }),
        );
        const hasActiveChild = mappedChildren?.some((child) => child.isActive) ?? false;
        const isCurrentItemActive = isItemActive(item.href) || hasActiveChild;

        return {
          ...item,
          hasChildren,
          isActive: isCurrentItemActive,
          isOpen: openGroups[item.id] ?? hasActiveChild,
          children: mappedChildren,
        };
      }),
    [isItemActive, items, openGroups],
  );

  return {
    mappedItems,
    toggleGroup,
    onItemClick,
  };
};
