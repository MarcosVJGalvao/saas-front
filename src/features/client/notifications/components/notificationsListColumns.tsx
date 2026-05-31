import { AppChip } from '@shared/components/data-display/AppChip';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import type { NotificationItem } from '@features/client/notifications/types/notification';

interface NotificationsColumnActions {
  onMarkAsRead: (notification: NotificationItem) => void;
}

export const buildNotificationsColumns = (
  actions: NotificationsColumnActions,
): DataTableColumn<NotificationItem>[] => [
  {
    key: 'message',
    header: 'Mensagem',
    render: (notification) => notification.message,
  },
  {
    key: 'read',
    header: 'Status',
    render: (notification) => (
      <AppChip
        size="small"
        color={notification.read ? 'default' : 'primary'}
        label={notification.read ? 'Lida' : 'Não lida'}
      />
    ),
  },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (notification) =>
      notification.read ? null : (
        <RowActionsMenu
          actions={[
            {
              key: 'mark-as-read',
              label: 'Marcar como lida',
              onClick: () => actions.onMarkAsRead(notification),
            },
          ]}
        />
      ),
  },
];
