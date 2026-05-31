import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppDivider } from '@shared/components/data-display/AppDivider';
import { AppText } from '@shared/components/data-display/AppText';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppBox } from '@shared/components/layout/AppBox';
import { appLayoutMessages } from '@app/layout/admin-navigation/messages';
import type { NotificationMenuItem } from '@features/client/notifications/types/notification';

interface NotificationMenuListProps {
  notifications: NotificationMenuItem[];
  loading: boolean;
  errorMessage: string | undefined;
  onNotificationClick: (notificationId: string) => void;
}

export const NotificationMenuList = ({
  notifications,
  loading,
  errorMessage,
  onNotificationClick,
}: NotificationMenuListProps) => {
  if (loading) {
    return (
      <AppBox sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <AppCircularProgress size={24} aria-label={appLayoutMessages.notificationsLoadingLabel} />
      </AppBox>
    );
  }

  if (errorMessage !== undefined) {
    return (
      <AppBox sx={{ px: 2, py: 3 }}>
        <AppText color="error">{errorMessage}</AppText>
      </AppBox>
    );
  }

  if (notifications.length === 0) {
    return (
      <AppBox sx={{ px: 2, py: 3 }}>
        <AppText sx={{ fontWeight: 600 }}>{appLayoutMessages.notificationsEmptyTitle}</AppText>
        <AppText variant="body2" color="text.secondary">
          {appLayoutMessages.notificationsEmptyDescription}
        </AppText>
      </AppBox>
    );
  }

  return (
    <AppBox sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
      {notifications.map((notification) => (
        <AppBox key={notification.id}>
          <AppButton
            onClick={() => onNotificationClick(notification.id)}
            variant="text"
            sx={{
              px: 2,
              py: 1.5,
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              textTransform: 'none',
              borderRadius: 0,
            }}
          >
            <AppBox sx={{ minWidth: 0, textAlign: 'left' }}>
              <AppText sx={{ fontWeight: notification.unread ? 700 : 500, color: 'text.primary' }}>
                {notification.message}
              </AppText>
              <AppText variant="body2" color="text.secondary">
                {notification.unread
                  ? appLayoutMessages.unreadNotificationLabel
                  : appLayoutMessages.readNotificationLabel}
              </AppText>
            </AppBox>
            <AppBox
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: notification.unread ? 'primary.main' : 'transparent',
                border: notification.unread ? 0 : '1px solid',
                borderColor: 'divider',
                mt: 0.75,
                ml: 1,
                flexShrink: 0,
              }}
            />
          </AppButton>
          <AppDivider />
        </AppBox>
      ))}
    </AppBox>
  );
};
