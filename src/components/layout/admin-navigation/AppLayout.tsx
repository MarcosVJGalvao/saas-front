import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import ViewDayOutlinedIcon from '@mui/icons-material/ViewDayOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { useCommandPalette } from '../../../hooks/useCommandPalette';
import { useDensityPreference } from '../../../hooks/useDensityPreference';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useSidebarState } from '../../../hooks/useSidebarState';
import { useThemePreference } from '../../../hooks/useThemePreference';
import { DENSITY_MODE, densityMetrics } from '../../../models/density';
import { brandByDomain, navigationByDomain } from './config';
import { CommandPalette } from './CommandPalette';
import { filterNavigationByPermissions, localPermissionResolver } from './permissions';
import { SessionTimer } from './SessionTimer';

const SIDEBAR_EXPANDED_WIDTH = 288;
const SIDEBAR_COLLAPSED_WIDTH = 84;

const SidebarContent = ({
  isCollapsed,
  onToggle,
  density,
  mobileMode = false,
  closeMobile,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  density: keyof typeof densityMetrics;
  mobileMode?: boolean;
  closeMobile?: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authDomain } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ usuarios: true });
  const domain = authDomain ?? 'platform';
  const brand = brandByDomain[domain];
  const Logo = brand.logo;
  const permissions = localPermissionResolver.getPermissions(domain);
  const items = filterNavigationByPermissions(navigationByDomain[domain], permissions);
  const sidebarItemHeight = densityMetrics[density].sidebarItemHeight;
  const submenuItemHeight = densityMetrics[density].submenuItemHeight;
  const sidebarHeaderHeight = densityMetrics[density].appBarHeight;

  const onItemClick = (href?: string) => {
    if (href !== undefined) {
      void navigate(href);
      closeMobile?.();
    }
  };

  return (
    <Box
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}
    >
      <Box
        sx={{
          px: 2,
          py: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: sidebarHeaderHeight,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Logo color="primary" />
          {!isCollapsed ? (
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {brand.label}
            </Typography>
          ) : null}
        </Box>
        <IconButton
          onClick={mobileMode ? () => closeMobile?.() : onToggle}
          size="small"
          aria-label={mobileMode ? 'Fechar menu lateral' : 'Alternar menu lateral'}
        >
          {mobileMode ? <CloseIcon /> : isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((item) => {
          const ItemIcon = item.icon;
          const isActive =
            item.href !== undefined ? location.pathname.startsWith(item.href) : false;
          const hasChildren = (item.children?.length ?? 0) > 0;
          return (
            <Box key={item.id}>
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  if (hasChildren)
                    setOpenGroups((previous) => ({ ...previous, [item.id]: !previous[item.id] }));
                  else onItemClick(item.href);
                }}
                sx={{
                  borderRadius: 2,
                  minHeight: sidebarItemHeight,
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: (themeObj) =>
                      themeObj.palette.mode === 'dark' ? 'rgba(99,102,241,0.14)' : 'action.hover',
                  },
                  '&.Mui-selected': {
                    bgcolor: (themeObj) =>
                      themeObj.palette.mode === 'dark'
                        ? 'rgba(99,102,241,0.24)'
                        : 'rgba(99,102,241,0.10)',
                    color: (themeObj) =>
                      themeObj.palette.mode === 'dark' ? '#c7d2fe' : themeObj.palette.primary.main,
                  },
                  '&.Mui-selected:hover': {
                    bgcolor: (themeObj) =>
                      themeObj.palette.mode === 'dark'
                        ? 'rgba(99,102,241,0.30)'
                        : 'rgba(99,102,241,0.14)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {ItemIcon !== undefined ? <ItemIcon /> : <HomeOutlinedIcon />}
                </ListItemIcon>
                {!isCollapsed ? <ListItemText primary={item.label} /> : null}
                {!isCollapsed && hasChildren ? (
                  openGroups[item.id] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )
                ) : null}
              </ListItemButton>
              {!isCollapsed && hasChildren && openGroups[item.id] ? (
                <List
                  sx={{
                    px: 1,
                    py: 0.75,
                    backgroundColor: (themeObj) =>
                      themeObj.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'action.hover',
                    border: 1,
                    borderColor: (themeObj) =>
                      themeObj.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'divider',
                    borderRadius: 2,
                  }}
                >
                  {item.children?.map((child) => (
                    <ListItemButton
                      key={child.id}
                      sx={{
                        borderRadius: 1.5,
                        minHeight: submenuItemHeight,
                        pl: 3.5,
                        '&:hover': {
                          bgcolor: (themeObj) =>
                            themeObj.palette.mode === 'dark'
                              ? 'rgba(99,102,241,0.12)'
                              : 'rgba(99,102,241,0.08)',
                        },
                        '&.Mui-selected': {
                          bgcolor: (themeObj) =>
                            themeObj.palette.mode === 'dark'
                              ? 'rgba(99,102,241,0.22)'
                              : 'rgba(99,102,241,0.12)',
                          color: (themeObj) =>
                            themeObj.palette.mode === 'dark'
                              ? '#c7d2fe'
                              : themeObj.palette.primary.main,
                        },
                      }}
                      selected={location.pathname.startsWith(child.href ?? '')}
                      onClick={() => onItemClick(child.href)}
                    >
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  ))}
                </List>
              ) : null}
            </Box>
          );
        })}
      </List>
    </Box>
  );
};

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  const { authDomain, session, clearAuth } = useAuth();
  const { density, setDensity } = useDensityPreference();
  const { theme, setTheme } = useThemePreference();
  const { isCollapsed, toggleSidebar, setIsCollapsed } = useSidebarState();
  const isMobile = useMediaQuery('(max-width:1023px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<HTMLElement | null>(null);

  const domain = authDomain ?? 'platform';
  const permissions = localPermissionResolver.getPermissions(domain);
  const navigationItems = useMemo(
    () => filterNavigationByPermissions(navigationByDomain[domain], permissions),
    [domain, permissions],
  );
  const palette = useCommandPalette(navigationItems);
  const sidebarWidth = isMobile
    ? 0
    : isCollapsed
      ? SIDEBAR_COLLAPSED_WIDTH
      : SIDEBAR_EXPANDED_WIDTH;
  const appBarHeight = densityMetrics[density].appBarHeight;
  const notifications = [
    {
      id: 'matricula',
      title: 'Nova matrícula realizada',
      description: 'A matrícula #12345 foi realizada com sucesso.',
      time: 'Há 2 minutos',
      unread: true,
      icon: <SchoolOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBg: 'rgba(99,102,241,0.14)',
      iconColor: '#6366F1',
    },
    {
      id: 'pagamento',
      title: 'Pagamento recebido',
      description: 'Você recebeu um pagamento de R$ 1.250,00',
      time: 'Há 15 minutos',
      unread: true,
      icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBg: 'rgba(34,197,94,0.14)',
      iconColor: '#16A34A',
    },
    {
      id: 'vencimento',
      title: 'Vencimento em 3 dias',
      description: 'A mensalidade da matrícula #98765 vence em 3 dias.',
      time: 'Há 1 hora',
      unread: true,
      icon: <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBg: 'rgba(245,158,11,0.16)',
      iconColor: '#D97706',
    },
    {
      id: 'boleto',
      title: 'Boleto gerado',
      description: 'Foi gerado um novo boleto para a matrícula #54321.',
      time: 'Há 2 horas',
      unread: false,
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBg: 'rgba(59,130,246,0.14)',
      iconColor: '#2563EB',
    },
    {
      id: 'usuario',
      title: 'Novo usuário cadastrado',
      description: 'O usuário Marcos Silva foi cadastrado no sistema.',
      time: 'Há 3 horas',
      unread: false,
      icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
      iconBg: 'rgba(139,92,246,0.14)',
      iconColor: '#7C3AED',
    },
  ];
  const userName = 'Dev Admin';
  const userInitials = userName
    .split(' ')
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join('')
    .toUpperCase();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (palette.isOpen) palette.close();
        else palette.open();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [palette]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isMobile ? (
        <Box
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            transition: 'width 220ms ease',
          }}
        >
          <SidebarContent
            isCollapsed={isCollapsed}
            onToggle={toggleSidebar}
            density={density}
            mobileMode={false}
          />
        </Box>
      ) : null}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          left: { lg: `${sidebarWidth}px`, xs: 0 },
          zIndex: 40,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ minHeight: `${appBarHeight}px !important`, px: { xs: 2, lg: 3 }, gap: 2 }}>
          {isMobile ? (
            <IconButton aria-label="Abrir menu" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Button
            onClick={palette.open}
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
              '& .MuiButton-startIcon': {
                mr: isMobile ? 0.75 : 1,
              },
              '& .MuiButton-endIcon': {
                ml: 1,
              },
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
              expiresIn={session?.expiresIn ?? '1h'}
              accessToken={session?.accessToken}
              compact={isMobile}
            />
            <IconButton
              onClick={(event) => {
                setProfileAnchor(null);
                setNotificationsAnchor(event.currentTarget);
              }}
              aria-label="Notificações"
            >
              <Badge color="primary" variant="dot">
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
            <Button
              onClick={(event) => {
                setNotificationsAnchor(null);
                setProfileAnchor(event.currentTarget);
              }}
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
                  <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Administrador
                  </Typography>
                </Box>
              ) : null}
            </Button>
          </Box>
        </Toolbar>
      </Box>

      <Box
        component="main"
        sx={{ flexGrow: 1, pt: `${appBarHeight + 24}px`, px: { xs: 2, lg: 3 }, pb: 3 }}
      >
        {children ?? <Outlet />}
      </Box>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: '86vw',
              maxWidth: 380,
              bgcolor: 'background.paper',
              backgroundImage: 'none',
            },
          },
        }}
      >
        <SidebarContent
          isCollapsed={false}
          onToggle={() => setIsCollapsed(false)}
          density={density}
          mobileMode
          closeMobile={() => setMobileOpen(false)}
        />
      </Drawer>

      <Menu
        anchorEl={notificationsAnchor}
        open={notificationsAnchor !== null}
        onClose={() => setNotificationsAnchor(null)}
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
          <Typography sx={{ fontWeight: 700 }}>Notificações</Typography>
          <Button size="small" sx={{ textTransform: 'none', minWidth: 0, p: 0 }}>
            Marcar todas como lidas
          </Button>
        </Box>
        <Divider />
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
              <Divider />
            </Box>
          ))}
        </Box>
        <Box sx={{ px: 2, py: 1.25 }}>
          <Button size="small" sx={{ textTransform: 'none', p: 0, minWidth: 0 }}>
            Ver todas as notificações
          </Button>
        </Box>
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={profileAnchor !== null}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              maxWidth: '94vw',
              borderRadius: 2.5,
              p: 1.75,
              mt: 0.75,
              backdropFilter: 'blur(18px)',
              backgroundColor: (themeObj) =>
                themeObj.palette.mode === 'dark' ? 'rgba(8,16,30,0.94)' : 'rgba(255,255,255,0.96)',
              border: 1,
              borderColor: (themeObj) =>
                themeObj.palette.mode === 'dark' ? 'rgba(125,179,255,0.18)' : 'divider',
              boxShadow: (themeObj) =>
                themeObj.palette.mode === 'dark'
                  ? '0 24px 60px rgba(1,8,22,0.58)'
                  : '0 20px 60px rgba(0,0,0,0.24)',
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1.5 }}>
          <Avatar
            sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: '#fff', fontWeight: 700 }}
          >
            {userInitials}
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }}>{userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              dev.admin@sistema.com
            </Typography>
            <Box
              sx={{
                mt: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: (themeObj) =>
                  themeObj.palette.mode === 'dark' ? 'rgba(89,121,255,0.28)' : 'primary.main',
                color: (themeObj) => (themeObj.palette.mode === 'dark' ? '#b9c8ff' : '#fff'),
                display: 'inline-block',
                fontSize: 12,
              }}
            >
              Administrador
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mb: 1.25, borderColor: 'rgba(125,179,255,0.16)' }} />
        <MenuItem sx={{ borderRadius: 2, mb: 1.25, gap: 1.25, minHeight: 38, px: 0.5 }}>
          <PersonOutlineOutlinedIcon fontSize="small" />
          Meu perfil
        </MenuItem>

        <Box sx={{ px: 0.25, py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WbSunnyOutlinedIcon fontSize="small" />
              <Typography variant="body1">Tema</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0, width: 'fit-content' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setTheme('light')}
                sx={{
                  borderRadius: '10px 0 0 10px',
                  minHeight: 34,
                  minWidth: 36,
                  borderColor: 'rgba(125,179,255,0.35)',
                  px: 0,
                }}
              >
                <WbSunnyOutlinedIcon sx={{ fontSize: 17 }} />
              </Button>
              <Button
                variant={theme === 'dark' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setTheme('dark')}
                sx={{
                  borderRadius: '0 10px 10px 0',
                  minHeight: 34,
                  minWidth: 36,
                  borderColor: 'rgba(125,179,255,0.35)',
                  px: 0,
                }}
              >
                <Brightness2OutlinedIcon sx={{ fontSize: 17 }} />
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 0.25, py: 1 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ViewStreamOutlinedIcon fontSize="small" />
              <Typography variant="body1">Densidade</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: 'fit-content', ml: 4 }}>
            <Button
              variant={density === DENSITY_MODE.COMPACT ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setDensity(DENSITY_MODE.COMPACT)}
              sx={{
                borderRadius: 1.5,
                minHeight: 32,
                minWidth: 52,
                borderColor: 'rgba(125,179,255,0.35)',
                px: 0.5,
              }}
            >
              <ViewAgendaOutlinedIcon sx={{ fontSize: 17 }} />
            </Button>
            <Button
              variant={density === DENSITY_MODE.NORMAL ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setDensity(DENSITY_MODE.NORMAL)}
              sx={{
                borderRadius: 1.5,
                minHeight: 32,
                minWidth: 52,
                borderColor: 'rgba(125,179,255,0.35)',
                px: 0.5,
              }}
            >
              <ViewStreamOutlinedIcon sx={{ fontSize: 17 }} />
            </Button>
            <Button
              variant={density === DENSITY_MODE.WIDE ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setDensity(DENSITY_MODE.WIDE)}
              sx={{
                borderRadius: 1.5,
                minHeight: 32,
                minWidth: 52,
                borderColor: 'rgba(125,179,255,0.35)',
                px: 0.5,
              }}
            >
              <ViewDayOutlinedIcon sx={{ fontSize: 17 }} />
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 0.75, borderColor: 'rgba(125,179,255,0.16)' }} />
        <MenuItem onClick={clearAuth} sx={{ color: 'error.main', borderRadius: 2, gap: 1.25 }}>
          <LogoutOutlinedIcon fontSize="small" />
          Sair da conta
        </MenuItem>
      </Menu>

      <CommandPalette
        isOpen={palette.isOpen}
        query={palette.query}
        favorites={palette.favorites}
        items={navigationItems}
        onClose={palette.close}
        onQueryChange={palette.setQuery}
        onToggleFavorite={palette.toggleFavorite}
      />
    </Box>
  );
};
