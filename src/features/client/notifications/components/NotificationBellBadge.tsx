import type { ReactNode } from 'react';
import { AppBadge } from '@shared/components/data-display/AppBadge';

interface NotificationBellBadgeProps {
  unreadCount: number;
  children: ReactNode;
}

export const NotificationBellBadge = ({ unreadCount, children }: NotificationBellBadgeProps) => (
  <AppBadge
    color="primary"
    badgeContent={unreadCount > 99 ? '99+' : unreadCount}
    invisible={unreadCount === 0}
  >
    {children}
  </AppBadge>
);
