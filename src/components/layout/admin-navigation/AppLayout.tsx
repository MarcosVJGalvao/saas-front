import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material/styles';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Outlet } from 'react-router-dom';
import { useAppLayoutState, buildUserInitials } from '../../../hooks/useAppLayoutState';
import { useAuth } from '../../../hooks/useAuth/useAuth';
import { useDensityPreference } from '../../../hooks/useDensityPreference';
import { useMediaQuery } from '../../../hooks/useMediaQuery';
import { useSidebarNavigation } from '../../../hooks/useSidebarNavigation';
import { useSidebarState } from '../../../hooks/useSidebarState';
import { useThemePreference } from '../../../hooks/useThemePreference';
import { densityMetrics } from '../../../models/density';
import { getUiColorTokens } from '../../../theme/uiColors';
import { CommandPalette } from './CommandPalette';
import { brandByDomain } from './config';
import { appLayoutMessages, appLayoutNotifications } from './messages';
import { NotificationsMenu } from './NotificationsMenu';
import { ProfileMenu } from './ProfileMenu';
import { SidebarContent } from './SidebarContent';
import { TopBar } from './TopBar';

const notificationIconsById: Record<string, ReactNode> = {
  matricula: <SchoolOutlinedIcon sx={{ fontSize: 18 }} />,
  pagamento: <AttachMoneyOutlinedIcon sx={{ fontSize: 18 }} />,
  vencimento: <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />,
  boleto: <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />,
  usuario: <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
};

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  const themeObj = useTheme();
  const uiColors = getUiColorTokens(themeObj.palette.mode);
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

  const notifications = appLayoutNotifications.map((notification) => ({
    ...notification,
    icon: notificationIconsById[notification.id],
    iconBg: uiColors[notification.iconBgToken],
    iconColor: uiColors[notification.iconColorToken],
  }));

  const appBarHeight = densityMetrics[density].appBarHeight;
  const brand = brandByDomain[domain];
  const userName = appLayoutMessages.defaultUserName;
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
            transition: themeObj.transitions.create('width'),
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
          transition: themeObj.transitions.create('left'),
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

      <Drawer anchor="left" open={mobileOpen} onClose={closeMobileMenu}>
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
        userEmail={appLayoutMessages.defaultUserEmail}
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
