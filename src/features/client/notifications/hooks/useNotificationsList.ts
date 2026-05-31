import { useCallback, useEffect, useState } from 'react';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import type { PaginationMeta } from '@shared/types/pagination';
import { notificationService } from '@features/client/notifications/services/service';
import type {
  NotificationItem,
  NotificationListQueryParams,
} from '@features/client/notifications/types/notification';

const DEFAULT_PAGINATION: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const NOTIFICATIONS_UPDATED_EVENT = 'client:notifications-updated';

export interface UseNotificationsListResult {
  rows: NotificationItem[];
  pagination: PaginationMeta;
  queryParams: NotificationListQueryParams;
  loading: boolean;
  errorMessage: string | undefined;
  isUnauthorized: boolean;
  isForbidden: boolean;
  updateQueryParams: (patch: Partial<NotificationListQueryParams>) => void;
  reload: () => Promise<void>;
}

export const dispatchNotificationsUpdated = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_UPDATED_EVENT));
  }
};

export const useNotificationsList = (
  initialParams?: Partial<NotificationListQueryParams>,
): UseNotificationsListResult => {
  const [rows, setRows] = useState<NotificationItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [queryParams, setQueryParams] = useState<NotificationListQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    setIsUnauthorized(false);
    setIsForbidden(false);

    try {
      const response = await notificationService.list(queryParams);
      setRows(response.data);
      setPagination(response.meta);
    } catch (error) {
      const normalizedError = ErrorHandler.normalize(error);
      setErrorMessage('Não foi possível carregar as notificações.');
      setIsUnauthorized(normalizedError.status === 401);
      setIsForbidden(normalizedError.status === 403);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchNotifications();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchNotifications]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const handleNotificationsUpdated = () => {
      void fetchNotifications();
    };

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleNotificationsUpdated);
    };
  }, [fetchNotifications]);

  const updateQueryParams = useCallback((patch: Partial<NotificationListQueryParams>) => {
    setQueryParams((currentQueryParams) => ({ ...currentQueryParams, ...patch }));
  }, []);

  return {
    rows,
    pagination,
    queryParams,
    loading,
    errorMessage,
    isUnauthorized,
    isForbidden,
    updateQueryParams,
    reload: fetchNotifications,
  };
};
