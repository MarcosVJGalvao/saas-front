import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigationItem } from '@models/navigation';

export interface SidebarLeafItem extends NavigationItem {
  isActive: boolean;
}

export interface SidebarChildItem extends NavigationItem {
  isActive: boolean;
  isOpen: boolean;
  hasChildren: boolean;
  children?: SidebarLeafItem[];
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

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
        if (item.type === 'section') {
          const { children: _c, ...rest } = item;
          return { ...rest, hasChildren: false, isActive: false, isOpen: false };
        }

        const mappedChildren = item.children?.map((child): SidebarChildItem => {
          const mappedGrandchildren = child.children?.map(
            (gc): SidebarLeafItem => ({ ...gc, isActive: isItemActive(gc.href) }),
          );
          const hasGrandchildren = (mappedGrandchildren?.length ?? 0) > 0;
          const hasActiveGrandchild = mappedGrandchildren?.some((gc) => gc.isActive) ?? false;
          const isChildActive = isItemActive(child.href) || hasActiveGrandchild;

          return {
            ...child,
            isActive: isChildActive,
            isOpen: openGroups[child.id] ?? hasActiveGrandchild,
            hasChildren: hasGrandchildren,
            children: mappedGrandchildren,
          };
        });

        const hasChildren = (mappedChildren?.length ?? 0) > 0;
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
