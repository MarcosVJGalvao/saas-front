import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '@features/client/notifications/services/service';
import { buildNotificationsColumns } from '@features/client/notifications/components/notificationsListColumns';
import {
  dispatchNotificationsUpdated,
  useNotificationsList,
} from '@features/client/notifications/hooks/useNotificationsList';
import type { NotificationItem } from '@features/client/notifications/types/notification';

export interface UseNotificationsListPageResult {
  notificationsList: ReturnType<typeof useNotificationsList>;
  tableColumns: ReturnType<typeof buildNotificationsColumns>;
  actionErrorMessage: string | undefined;
  actionSuccessMessage: string | undefined;
  clearFeedback: () => void;
  onQueryChange: (nextValue: string) => void;
  onPageChange: (nextPage: number) => void;
  onRowsPerPageChange: (nextLimit: number) => void;
  onOpenSendPage: () => void;
}

export const useNotificationsListPage = (): UseNotificationsListPageResult => {
  const navigate = useNavigate();
  const notificationsList = useNotificationsList();
  const [actionErrorMessage, setActionErrorMessage] = useState<string | undefined>();
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | undefined>();

  const handleMarkAsRead = useCallback(
    async (notification: NotificationItem) => {
      try {
        await notificationService.markAsRead(notification.id);
        setActionErrorMessage(undefined);
        setActionSuccessMessage('Notificação marcada como lida.');
        await notificationsList.reload();
        dispatchNotificationsUpdated();
      } catch {
        setActionSuccessMessage(undefined);
        setActionErrorMessage('Não foi possível marcar a notificação como lida.');
      }
    },
    [notificationsList],
  );

  const tableColumns = buildNotificationsColumns({
    onMarkAsRead: (notification) => {
      void handleMarkAsRead(notification);
    },
  });

  return {
    notificationsList,
    tableColumns,
    actionErrorMessage,
    actionSuccessMessage,
    clearFeedback: () => {
      setActionErrorMessage(undefined);
      setActionSuccessMessage(undefined);
    },
    onQueryChange: () => undefined,
    onPageChange: (nextPage) => {
      notificationsList.updateQueryParams({ page: nextPage });
    },
    onRowsPerPageChange: (nextLimit) => {
      notificationsList.updateQueryParams({ page: 1, limit: nextLimit });
    },
    onOpenSendPage: () => {
      void navigate('/client/notifications/send');
    },
  };
};
