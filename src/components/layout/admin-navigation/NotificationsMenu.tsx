import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { getUiColorTokens } from '../../../theme/uiColors';
import { appLayoutMessages } from './messages';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
}

export const NotificationsMenu = ({
  anchorEl,
  open,
  onClose,
  notifications,
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
        <Button size="small" sx={{ textTransform: 'none', minWidth: 0, p: 0 }}>
          {appLayoutMessages.markAllRead}
        </Button>
      </Box>

      <Divider sx={{ borderColor: uiColors.menuDivider }} />

      <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {notifications.map((notification) => (
          <Box key={notification.id}>
            <Box sx={{ px: 2, py: 1.25, display: 'flex', gap: 1.25, alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  bgcolor: notification.iconBg,
                  color: notification.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {notification.icon}
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {notification.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                      {notification.time}
                    </Typography>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        bgcolor: notification.unread ? 'primary.main' : 'transparent',
                        border: notification.unread ? 0 : '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>
                  {notification.description}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ borderColor: uiColors.menuDivider }} />
          </Box>
        ))}
      </Box>

      <Box sx={{ px: 2, py: 1.25 }}>
        <Button size="small" sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>
          {appLayoutMessages.viewAllNotifications}
        </Button>
      </Box>
    </Menu>
  );
};
