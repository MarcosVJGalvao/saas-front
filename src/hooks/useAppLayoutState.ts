import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react';
import type { NavigationItem } from '../models/navigation';
import { useCommandPalette } from './useCommandPalette';

const SIDEBAR_EXPANDED_WIDTH = 230;
const SIDEBAR_COLLAPSED_WIDTH = 84;

export const buildUserInitials = (userName: string): string =>
  userName
    .split(' ')
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join('')
    .toUpperCase();

export const useAppLayoutState = (
  navigationItems: NavigationItem[],
  isMobile: boolean,
  isCollapsed: boolean,
) => {
  const palette = useCommandPalette(navigationItems);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<HTMLElement | null>(null);

  const openMobileMenu = useCallback(() => setMobileOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  const openNotificationsMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setProfileAnchor(null);
    setNotificationsAnchor(event.currentTarget);
  }, []);

  const openProfileMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(null);
    setProfileAnchor(event.currentTarget);
  }, []);

  const closeNotificationsMenu = useCallback(() => setNotificationsAnchor(null), []);
  const closeProfileMenu = useCallback(() => setProfileAnchor(null), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (palette.isOpen) palette.close();
        else palette.open();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [palette]);

  const sidebarWidth = useMemo(() => {
    if (isMobile) return 0;
    return isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH;
  }, [isCollapsed, isMobile]);

  return {
    palette,
    mobileOpen,
    openMobileMenu,
    closeMobileMenu,
    profileAnchor,
    notificationsAnchor,
    openNotificationsMenu,
    openProfileMenu,
    closeNotificationsMenu,
    closeProfileMenu,
    sidebarWidth,
  };
};
