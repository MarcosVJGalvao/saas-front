import type { MouseEventHandler } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { getUiColorTokens } from '../../../theme/uiColors';
import { appLayoutMessages } from './messages';
import { SessionTimer } from './SessionTimer';

interface TopBarProps {
  appBarHeight: number;
  isMobile: boolean;
  userName: string;
  userInitials: string;
  sessionExpiresIn?: string;
  sessionAccessToken?: string;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenNotificationsMenu: MouseEventHandler<HTMLElement>;
  onOpenProfileMenu: MouseEventHandler<HTMLElement>;
}

const TopBarSearchShortcut = ({ isMobile }: { isMobile: boolean }) =>
  !isMobile ? (
    <Box sx={{ px: 1, py: 0.25, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      {appLayoutMessages.keyboardShortcut}
    </Box>
  ) : null;

const TopBarUserInfo = ({ isMobile, userName }: { isMobile: boolean; userName: string }) =>
  !isMobile ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        lineHeight: 1.15,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{userName}</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
        {appLayoutMessages.roleLabel}
      </Typography>
    </Box>
  ) : null;

export const TopBar = ({
  appBarHeight,
  isMobile,
  userName,
  userInitials,
  sessionExpiresIn,
  sessionAccessToken,
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenNotificationsMenu,
  onOpenProfileMenu,
}: TopBarProps) => {
  const themeObj = useTheme();
  const uiColors = getUiColorTokens(themeObj.palette.mode);

  return (
    <Toolbar sx={{ minHeight: `${appBarHeight}px !important`, px: { xs: 2, lg: 3 }, gap: 2 }}>
      {isMobile ? (
        <IconButton aria-label={appLayoutMessages.openMenuAriaLabel} onClick={onOpenMobileMenu}>
          <MenuIcon />
        </IconButton>
      ) : null}
      <Button
        onClick={onOpenCommandPalette}
        startIcon={<SearchOutlinedIcon />}
        sx={{
          width: { xs: '100%', sm: 300, md: 360, lg: 560 },
          maxWidth: { xs: 220, sm: 'none' },
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          textTransform: 'none',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          px: 1.5,
          py: 1,
          color: 'text.secondary',
        }}
      >
        {appLayoutMessages.searchPlaceholder}
        <TopBarSearchShortcut isMobile={isMobile} />
      </Button>
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <SessionTimer
          expiresIn={sessionExpiresIn ?? '1h'}
          accessToken={sessionAccessToken}
          compact={isMobile}
        />
        <IconButton
          onClick={onOpenNotificationsMenu}
          aria-label={appLayoutMessages.notificationsAriaLabel}
        >
          <Badge color="primary" variant="dot">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <Button
          onClick={onOpenProfileMenu}
          sx={{ textTransform: 'none', color: 'text.primary' }}
          endIcon={<ExpandMoreIcon />}
        >
          <Avatar
            sx={{
              width: isMobile ? 34 : 36,
              height: isMobile ? 34 : 36,
              mr: isMobile ? 0 : 1,
              background: uiColors.topBarAvatarGradient,
              color: 'common.white',
              fontWeight: 700,
              fontSize: isMobile ? 13 : 14,
            }}
          >
            {userInitials}
          </Avatar>
          <TopBarUserInfo isMobile={isMobile} userName={userName} />
        </Button>
      </Box>
    </Toolbar>
  );
};
