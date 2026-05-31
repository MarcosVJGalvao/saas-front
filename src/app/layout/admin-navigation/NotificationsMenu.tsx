import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { getUiColorTokens } from '@theme/uiColors';
import { appLayoutMessages } from '@app/layout/admin-navigation/messages';
import { NotificationMenuList } from '@features/client/notifications/components/NotificationMenuList';
import type { NotificationMenuItem } from '@features/client/notifications/types/notification';

interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  notifications: NotificationMenuItem[];
  loading: boolean;
  errorMessage: string | undefined;
  onNotificationClick: (notificationId: string) => void;
  onMarkAllRead: () => void;
  onViewAllNotifications: () => void;
}

export const NotificationsMenu = ({
  anchorEl,
  open,
  onClose,
  notifications,
  loading,
  errorMessage,
  onNotificationClick,
  onMarkAllRead,
  onViewAllNotifications,
}: NotificationsMenuProps) => {
  const themeObj = useTheme();
  const uiColors = getUiColorTokens(themeObj.palette.mode);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            width: 450,
            maxWidth: '92vw',
            borderRadius: 2.5,
            p: 0,
            mt: 0.75,
            overflow: 'hidden',
            backdropFilter: 'blur(18px)',
            transition: themeObj.transitions.create(['opacity', 'transform']),
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ fontWeight: 700 }}>{appLayoutMessages.notificationsTitle}</Typography>
        <Button
          size="small"
          sx={{ textTransform: 'none', minWidth: 0, p: 0 }}
          onClick={onMarkAllRead}
        >
          {appLayoutMessages.markAllRead}
        </Button>
      </Box>

      <Divider sx={{ borderColor: uiColors.menuDivider }} />

      <NotificationMenuList
        notifications={notifications}
        loading={loading}
        errorMessage={errorMessage}
        onNotificationClick={onNotificationClick}
      />

      <Box sx={{ px: 2, py: 1.25 }}>
        <Button
          size="small"
          sx={{ textTransform: 'none', p: 0, minWidth: 0 }}
          onClick={onViewAllNotifications}
        >
          {appLayoutMessages.viewAllNotifications}
        </Button>
      </Box>
    </Menu>
  );
};
