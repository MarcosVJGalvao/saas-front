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
import { getUiColorTokens } from '@theme/uiColors';
import { fontSizes } from '@theme/fontSizes';
import { appLayoutMessages } from '@app/layout/admin-navigation/messages';
import { SessionTimer } from '@app/layout/admin-navigation/SessionTimer';

interface TopBarProps {
  appBarHeight: number;
  isMobile: boolean;
  currentPageLabel: string;
  userName: string;
  userInitials: string;
  userRole: string;
  sessionExpiresIn?: string | undefined;
  sessionAccessToken?: string | undefined;
  onSessionExpired?: (() => void) | undefined;
  onOpenMobileMenu: () => void;
  onOpenCommandPalette: () => void;
  onOpenNotificationsMenu: MouseEventHandler<HTMLElement>;
  onOpenProfileMenu: MouseEventHandler<HTMLElement>;
}

const getSearchContainerSx = (isMobile: boolean) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  flex: isMobile ? 1 : '1 1 auto',
  minWidth: 0,
});

const TopBarSearchLabel = () => (
  <Box
    component="span"
    sx={{
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: { xs: 'none', sm: 'block' },
    }}
  >
    {appLayoutMessages.searchPlaceholder}
  </Box>
);

const TopBarSearchShortcut = ({ isMobile }: { isMobile: boolean }) =>
  !isMobile ? (
    <Box
      sx={{
        px: 0.75,
        py: 0,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        fontSize: fontSizes.sm,
        lineHeight: '20px',
        height: 22,
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      {appLayoutMessages.keyboardShortcut}
    </Box>
  ) : null;

const sessionTimerContainerSx = {
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
};

const TopBarUserInfo = ({
  isMobile,
  userName,
  userRole,
}: {
  isMobile: boolean;
  userName: string;
  userRole: string;
}) =>
  !isMobile ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        lineHeight: 1.15,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: fontSizes.lg }}>{userName}</Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: fontSizes.md }}>{userRole}</Typography>
    </Box>
  ) : null;

export const TopBar = ({
  appBarHeight,
  isMobile,
  currentPageLabel,
  userName,
  userInitials,
  userRole,
  sessionExpiresIn,
  sessionAccessToken,
  onSessionExpired,
  onOpenMobileMenu,
  onOpenCommandPalette,
  onOpenNotificationsMenu,
  onOpenProfileMenu,
}: TopBarProps) => {
  const themeObj = useTheme();
  const uiColors = getUiColorTokens(themeObj.palette.mode);

  return (
    <Toolbar
      sx={{
        minHeight: `${appBarHeight}px !important`,
        px: { xs: 2, lg: 3 },
        gap: { xs: 1, md: 1.5, lg: 2 },
      }}
    >
      {isMobile ? (
        <IconButton aria-label={appLayoutMessages.openMenuAriaLabel} onClick={onOpenMobileMenu}>
          <MenuIcon />
        </IconButton>
      ) : null}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '1.125rem', lg: '1.25rem' },
          minWidth: { xs: 0, sm: 120, md: 140 },
          maxWidth: { xs: 76, sm: 160, lg: 220 },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flexShrink: 1,
        }}
      >
        {currentPageLabel}
      </Typography>
      <Box sx={getSearchContainerSx(isMobile)}>
        <Button
          onClick={onOpenCommandPalette}
          startIcon={<SearchOutlinedIcon />}
          sx={{
            width: { xs: 42, sm: '100%' },
            maxWidth: { xs: 42, sm: 220, md: 260, lg: 340 },
            minWidth: { xs: 42, sm: 180 },
            justifyContent: { xs: 'center', sm: isMobile ? 'flex-start' : 'space-between' },
            textTransform: 'none',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            px: { xs: 0, sm: 1.25 },
            py: 0.25,
            height: 38,
            minHeight: 38,
            color: 'text.secondary',
            '& .MuiButton-startIcon': {
              mr: { xs: 0, sm: 0.75 },
              ml: { xs: 0 },
            },
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          <Box
            component="span"
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              minWidth: 0,
              gap: 1,
            }}
          >
            <TopBarSearchLabel />
            <TopBarSearchShortcut isMobile={isMobile} />
          </Box>
        </Button>
      </Box>
      <Box
        sx={{
          ml: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, md: 1.5 },
          flexShrink: 0,
        }}
      >
        <Box sx={sessionTimerContainerSx}>
          <SessionTimer
            expiresIn={sessionExpiresIn ?? '1h'}
            accessToken={sessionAccessToken}
            compact={isMobile}
            onExpired={onSessionExpired}
          />
        </Box>
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
              fontSize: isMobile ? fontSizes.sm : fontSizes.md,
            }}
          >
            {userInitials}
          </Avatar>
          <TopBarUserInfo isMobile={isMobile} userName={userName} userRole={userRole} />
        </Button>
      </Box>
    </Toolbar>
  );
};
