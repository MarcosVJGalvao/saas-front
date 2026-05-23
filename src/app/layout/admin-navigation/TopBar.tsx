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
import { responsive } from '@theme/utils/responsive';
import { appLayoutMessages } from '@app/layout/admin-navigation/messages';
import { SessionTimer } from '@app/layout/admin-navigation/SessionTimer';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';

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
  flex: isMobile ? '0 0 auto' : '1 1 auto',
  minWidth: 0,
});

const getSearchButtonMaxWidth = (shouldCompactTopBar: boolean) =>
  shouldCompactTopBar
    ? responsive({ xs: '42px', sm: '220px', md: '220px', lg: '240px' })
    : responsive({ xs: '42px', sm: '220px', md: '260px', lg: '340px' });

const getSearchButtonMinWidth = (shouldCompactTopBar: boolean) =>
  shouldCompactTopBar
    ? responsive({ xs: '42px', sm: '120px' })
    : responsive({ xs: '42px', sm: '180px' });

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

const TopBarSearchShortcut = ({ hideShortcut }: { hideShortcut: boolean }) =>
  !hideShortcut ? (
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
  hideUserInfo,
  userName,
  userRole,
}: {
  hideUserInfo: boolean;
  userName: string;
  userRole: string;
}) =>
  !hideUserInfo ? (
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
  const isCompactDesktop = useMediaQuery(themeObj.breakpoints.down('xl'));
  const shouldCompactTopBar = isMobile || isCompactDesktop;
  const searchButtonMaxWidth = getSearchButtonMaxWidth(shouldCompactTopBar);
  const searchButtonMinWidth = getSearchButtonMinWidth(shouldCompactTopBar);
  const profileButtonPaddingX = shouldCompactTopBar ? 0.5 : 1.25;

  return (
    <Toolbar
      sx={{
        minHeight: `${appBarHeight}px !important`,
        px: responsive({ xs: 2, lg: 3 }),
        gap: responsive({ xs: 1, md: 1.5, lg: 2 }),
        flexWrap: 'nowrap',
        overflow: 'hidden',
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
          flex: 1,
          fontWeight: 600,
          fontSize: responsive({ xs: '1.125rem', lg: '1.25rem' }),
          minWidth: 0,
          maxWidth: responsive({
            xs: isMobile ? 'none' : '160px',
            lg: isMobile ? 'none' : '220px',
          }),
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
            width: responsive({ xs: '42px', sm: '100%' }),
            maxWidth: searchButtonMaxWidth,
            minWidth: searchButtonMinWidth,
            flexShrink: 0,
            justifyContent: responsive({
              xs: 'center',
              sm: isMobile ? 'flex-start' : 'space-between',
            }),
            textTransform: 'none',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1.5,
            px: responsive({ xs: 0, sm: 1.25 }),
            py: 0.25,
            height: 38,
            minHeight: 38,
            color: 'text.secondary',
            '& .MuiButton-startIcon': {
              mr: responsive({ xs: 0, sm: 0.75 }),
              ml: responsive({ xs: 0 }),
            },
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          <Box
            component="span"
            sx={{
              display: responsive({ xs: 'none', sm: 'flex' }),
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              minWidth: 0,
              gap: 1,
            }}
          >
            <TopBarSearchLabel />
            <TopBarSearchShortcut hideShortcut={shouldCompactTopBar} />
          </Box>
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: responsive({ xs: 0.5, md: 1.5 }),
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        <Box sx={sessionTimerContainerSx}>
          <SessionTimer
            expiresIn={sessionExpiresIn ?? '1h'}
            accessToken={sessionAccessToken}
            compact={shouldCompactTopBar}
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
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            minWidth: 0,
            px: profileButtonPaddingX,
          }}
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
          <TopBarUserInfo
            hideUserInfo={shouldCompactTopBar}
            userName={userName}
            userRole={userRole}
          />
        </Button>
      </Box>
    </Toolbar>
  );
};
