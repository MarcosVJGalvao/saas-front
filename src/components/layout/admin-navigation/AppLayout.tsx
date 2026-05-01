import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { useAppLayoutState, buildUserInitials } from '../../../hooks/useAppLayoutState';
import { useDensityPreference } from '../../../hooks/useDensityPreference';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useSidebarNavigation } from '../../../hooks/useSidebarNavigation';
import { useSidebarState } from '../../../hooks/useSidebarState';
import { useThemePreference } from '../../../hooks/useThemePreference';
import { densityMetrics } from '../../../models/density';
import { brandByDomain } from './config';
import { CommandPalette } from './CommandPalette';
import { NotificationsMenu } from './NotificationsMenu';
import { ProfileMenu } from './ProfileMenu';
import { SidebarContent } from './SidebarContent';
import { TopBar } from './TopBar';

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

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  const { authDomain, session, clearAuth } = useAuth();
  const { density, setDensity } = useDensityPreference();
  const { theme, setTheme } = useThemePreference();
  const { isCollapsed, toggleSidebar, setIsCollapsed } = useSidebarState();
  const isMobile = useMediaQuery('(max-width:1023px)');
  const { domain, navigationItems } = useSidebarNavigation(authDomain);
  const {
    palette,
    mobileOpen,
    openMobileMenu,
    closeMobileMenu,
    profileAnchor,
    notificationsAnchor,
    openNotificationsMenu,
    openProfileMenu,
    closeNotificationsMenu,
    closeProfileMenu,
    sidebarWidth,
  } = useAppLayoutState(navigationItems, isMobile, isCollapsed);

  const appBarHeight = densityMetrics[density].appBarHeight;
  const brand = brandByDomain[domain];
  const userName = 'Dev Admin';
  const userInitials = buildUserInitials(userName);

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
            brand={brand}
            items={navigationItems}
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
        <TopBar
          appBarHeight={appBarHeight}
          isMobile={isMobile}
          userName={userName}
          userInitials={userInitials}
          sessionExpiresIn={session?.expiresIn}
          sessionAccessToken={session?.accessToken}
          onOpenMobileMenu={openMobileMenu}
          onOpenCommandPalette={palette.open}
          onOpenNotificationsMenu={openNotificationsMenu}
          onOpenProfileMenu={openProfileMenu}
        />
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
        onClose={closeMobileMenu}
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
          brand={brand}
          items={navigationItems}
          mobileMode
          closeMobile={closeMobileMenu}
        />
      </Drawer>

      <NotificationsMenu
        anchorEl={notificationsAnchor}
        open={notificationsAnchor !== null}
        onClose={closeNotificationsMenu}
        notifications={notifications}
      />

      <ProfileMenu
        anchorEl={profileAnchor}
        open={profileAnchor !== null}
        onClose={closeProfileMenu}
        userName={userName}
        userInitials={userInitials}
        theme={theme}
        density={density}
        onSetTheme={setTheme}
        onSetDensity={setDensity}
        onLogout={clearAuth}
      />

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
