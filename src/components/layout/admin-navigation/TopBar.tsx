import type { MouseEventHandler } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
}: TopBarProps) => (
  <Toolbar sx={{ minHeight: `${appBarHeight}px !important`, px: { xs: 2, lg: 3 }, gap: 2 }}>
    {isMobile ? (
      <IconButton aria-label="Abrir menu" onClick={onOpenMobileMenu}>
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
        '& .MuiButton-startIcon': { mr: isMobile ? 0.75 : 1 },
        '& .MuiButton-endIcon': { ml: 1 },
      }}
    >
      Buscar no sistema...
      {!isMobile ? (
        <Box sx={{ px: 1, py: 0.25, border: 1, borderColor: 'divider', borderRadius: 1 }}>
          Ctrl + K
        </Box>
      ) : null}
    </Button>
    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <SessionTimer
        expiresIn={sessionExpiresIn ?? '1h'}
        accessToken={sessionAccessToken}
        compact={isMobile}
      />
      <IconButton onClick={onOpenNotificationsMenu} aria-label="Notifica��es">
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
            background: 'linear-gradient(135deg, #5B6CFF 0%, #6C4BFF 100%)',
            color: '#fff',
            fontWeight: 700,
            fontSize: isMobile ? 13 : 14,
            letterSpacing: 0,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {userInitials}
        </Avatar>
        {!isMobile ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: 1.15,
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{userName}</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>Administrador</Typography>
          </Box>
        ) : null}
      </Button>
    </Box>
  </Toolbar>
);
