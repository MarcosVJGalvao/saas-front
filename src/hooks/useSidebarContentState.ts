import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigationItem } from '../models/navigation';

export const useSidebarContentState = (items: NavigationItem[], closeMobile?: () => void) => {
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

  const mappedItems = useMemo(
    () =>
      items.map((item) => {
        const hasChildren = (item.children?.length ?? 0) > 0;
        return {
          ...item,
          hasChildren,
          isActive: isItemActive(item.href),
          isOpen: openGroups[item.id] ?? false,
          children: item.children?.map((child) => ({
            ...child,
            isActive: isItemActive(child.href),
          })),
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
