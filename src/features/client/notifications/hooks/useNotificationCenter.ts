import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { toNotificationMenuItems } from '@features/client/notifications/normalizers/notification.normalizer';
import { notificationsRealtime } from '@features/client/notifications/services/realtime';
import { notificationService } from '@features/client/notifications/services/service';
import { dispatchNotificationsUpdated } from '@features/client/notifications/hooks/useNotificationsList';
import type {
  NotificationItem,
  NotificationMenuItem,
} from '@features/client/notifications/types/notification';

const MENU_LIMIT = 5;

const upsertNotification = (
  currentNotifications: NotificationItem[],
  nextNotification: NotificationItem,
): NotificationItem[] => {
  const notificationsWithoutCurrent = currentNotifications.filter(
    (notification) => notification.id !== nextNotification.id,
  );

  return [nextNotification, ...notificationsWithoutCurrent];
};

export interface UseNotificationCenterResult {
  notifications: NotificationItem[];
  menuItems: NotificationMenuItem[];
  unreadCount: number;
  loading: boolean;
  errorMessage: string | undefined;
  snackbarMessage: string | undefined;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllVisibleAsRead: () => Promise<void>;
  clearSnackbar: () => void;
}

export const useNotificationCenter = (): UseNotificationCenterResult => {
  const { authDomain, session } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [snackbarMessage, setSnackbarMessage] = useState<string | undefined>();

  const loadNotifications = useCallback(async () => {
    if (authDomain !== 'client') {
      setNotifications([]);
      setLoading(false);
      setErrorMessage(undefined);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    try {
      const response = await notificationService.list({ page: 1, limit: MENU_LIMIT });
      setNotifications(response.data);
    } catch (error) {
      const normalizedError = ErrorHandler.normalize(error);
      setErrorMessage(normalizedError.message);
    } finally {
      setLoading(false);
    }
  }, [authDomain]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadNotifications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadNotifications]);

  useEffect(() => {
    if (authDomain !== 'client' || session?.accessToken === undefined) {
      return undefined;
    }

    notificationsRealtime.connect(session.accessToken);

    const unsubscribe = notificationsRealtime.subscribe((incomingNotification) => {
      setNotifications((currentNotifications) =>
        upsertNotification(currentNotifications, incomingNotification).slice(0, MENU_LIMIT),
      );
      setSnackbarMessage(incomingNotification.message);
      dispatchNotificationsUpdated();
    });

    return () => {
      unsubscribe();
      notificationsRealtime.disconnect();
    };
  }, [authDomain, session?.accessToken]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (authDomain !== 'client') {
        return;
      }
      const updatedNotification = await notificationService.markAsRead(notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId ? updatedNotification : notification,
        ),
      );
      dispatchNotificationsUpdated();
    },
    [authDomain],
  );

  const markAllVisibleAsRead = useCallback(async () => {
    if (authDomain !== 'client') {
      return;
    }
    const unreadNotifications = notifications.filter((notification) => !notification.read);

    await Promise.all(
      unreadNotifications.map(async (notification) => {
        const updatedNotification = await notificationService.markAsRead(notification.id);
        setNotifications((currentNotifications) =>
          currentNotifications.map((currentNotification) =>
            currentNotification.id === notification.id ? updatedNotification : currentNotification,
          ),
        );
      }),
    );

    dispatchNotificationsUpdated();
  }, [authDomain, notifications]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  return {
    notifications,
    menuItems: toNotificationMenuItems(notifications),
    unreadCount,
    loading,
    errorMessage,
    snackbarMessage,
    markAsRead,
    markAllVisibleAsRead,
    clearSnackbar: () => setSnackbarMessage(undefined),
  };
};
