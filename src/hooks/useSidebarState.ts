import { useCallback, useState } from 'react';
import { ADMIN_NAVIGATION_STORAGE_KEYS } from '../models/adminNavigationStorage';

const readSidebarCollapsed = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(ADMIN_NAVIGATION_STORAGE_KEYS.sidebarCollapsed) === 'true';
};

export const useSidebarState = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(readSidebarCollapsed);

  const toggle = useCallback(() => {
    setIsCollapsed((previousState) => {
      const nextState = !previousState;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          ADMIN_NAVIGATION_STORAGE_KEYS.sidebarCollapsed,
          String(nextState),
        );
      }
      return nextState;
    });
  }, []);

  return { isCollapsed, toggleSidebar: toggle, setIsCollapsed };
};
