import { Suspense, useLayoutEffect, useRef, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import GlobalStyles from '@mui/material/GlobalStyles';
import { useTheme } from '@mui/material/styles';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppLayoutState, buildUserInitials } from '@shared/hooks/useAppLayoutState';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { resolveProfilePathByDomain } from '@shared/utils/profileRoutes';
import { useAppLayoutSessionGate } from '@app/layout/admin-navigation/useAppLayoutSessionGate';
import { useClientProfile } from '@features/client/auth/hooks/useClientProfile';
import { usePlatformProfile } from '@features/platform/auth/hooks/usePlatformProfile';
import { useDensityPreference } from '@shared/hooks/useDensityPreference';
import { useMediaQuery } from '@shared/hooks/useMediaQuery';
import { useSidebarNavigation } from '@shared/hooks/useSidebarNavigation';
import { useSidebarState } from '@shared/hooks/useSidebarState';
import { useThemePreference } from '@shared/hooks/useThemePreference';
import { densityMetrics } from '@shared/types/density';
import type { NavigationItem } from '@shared/types/navigation';
import { responsive } from '@theme/utils/responsive';
import { CommandPalette } from '@app/layout/admin-navigation/CommandPalette';
import { brandByDomain } from '@app/layout/admin-navigation/config';
import { NotificationsMenu } from '@app/layout/admin-navigation/NotificationsMenu';
import { ProfileMenu } from '@app/layout/admin-navigation/ProfileMenu';
import { SidebarContent } from '@app/layout/admin-navigation/SidebarContent';
import { TopBar } from '@app/layout/admin-navigation/TopBar';
import { AppSnackbar } from '@shared/components/feedback/AppSnackbar';
import { useNotificationCenter } from '@features/client/notifications/hooks/useNotificationCenter';

const TOKEN_EXPIRED_EVENT = 'app:token-expired';

const pageEnterStyles = {
  '@keyframes page-enter': {
    '0%': { opacity: 0, transform: 'translateY(5px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
};

const getCurrentPageLabel = (pathname: string, navigationItems: NavigationItem[]): string => {
  if (pathname.startsWith('/client/notifications')) {
    return 'Notificações';
  }
  const entries = navigationItems.reduce<NavigationItem[]>(
    (accumulator, item) => accumulator.concat(item, item.children ?? []),
    [],
  );
  const activeItem = entries
    .filter((entry) => entry.href !== undefined && pathname.startsWith(entry.href))
    .sort((left, right) => (right.href?.length ?? 0) - (left.href?.length ?? 0))[0];

  return activeItem?.label ?? 'Dashboard';
};

const resolvePermissions = (
  profile: { permissions: string[] } | null,
  errorMessage: string,
): string[] | undefined => {
  if (profile !== null) {
    return profile.permissions;
  }
  if (errorMessage.length > 0) {
    return undefined;
  }
  return [];
};

const getProfileHookEnabled = (
  authDomain: string | null,
  session: unknown,
  expectedDomain: 'platform' | 'client',
): boolean => authDomain === expectedDomain && session !== null;

interface UserDisplay {
  userName: string;
  userEmail: string;
  userRole: string;
}

const resolvePlatformUserDisplay = (
  platformProfile: { name: string; email: string; roles: string[] } | null,
): UserDisplay => ({
  userName: platformProfile?.name ?? 'Usuário',
  userEmail: platformProfile?.email ?? '-',
  userRole: platformProfile?.roles[0] ?? '-',
});

const resolveClientUserDisplay = (
  clientProfile: { name: string; email: string; client: { role: string } } | null,
): UserDisplay => ({
  userName: clientProfile?.name ?? 'Usuário',
  userEmail: clientProfile?.email ?? '-',
  userRole: clientProfile?.client.role ?? '-',
});

const resolveUserDisplay = (
  domain: 'platform' | 'client',
  platformProfile: { name: string; email: string; roles: string[] } | null,
  clientProfile: { name: string; email: string; client: { role: string } } | null,
): UserDisplay =>
  domain === 'client'
    ? resolveClientUserDisplay(clientProfile)
    : resolvePlatformUserDisplay(platformProfile);

export const AppLayout = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const themeObj = useTheme();
  const { authDomain, session, clearAuth } = useAuth();
  const { profile: platformProfile, errorMessage: platformProfileError } = usePlatformProfile({
    enabled: getProfileHookEnabled(authDomain, session, 'platform'),
  });
  const { profile: clientProfile, errorMessage: clientProfileError } = useClientProfile({
    enabled: getProfileHookEnabled(authDomain, session, 'client'),
  });
  const { density, setDensity } = useDensityPreference();
  const { theme, setTheme } = useThemePreference();
  const { isCollapsed, toggleSidebar, setIsCollapsed } = useSidebarState();
  const isMobile = useMediaQuery(themeObj.breakpoints.down('lg'));
  const { domain, navigationItems } = useSidebarNavigation(authDomain, {
    platformPermissions: resolvePermissions(platformProfile, platformProfileError),
    clientPermissions: resolvePermissions(clientProfile, clientProfileError),
  });
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

  const sessionGate = useAppLayoutSessionGate({
    pathname: location.pathname,
    platformProfile,
    platformProfileError,
    clientProfile,
    clientProfileError,
    closeProfileMenu,
  });

  const contentRef = useRef<HTMLElement>(null);
  const notificationCenter = useNotificationCenter();

  useLayoutEffect(() => {
    const element = contentRef.current;
    if (element === null) {
      return;
    }
    element.style.animation = 'none';
    void element.offsetHeight;
    element.style.animation = 'page-enter 220ms ease-out both';
  }, [location.key]);

  const appBarHeight = densityMetrics[density].appBarHeight;
  const brand = brandByDomain[domain];
  const { userName, userEmail, userRole } = resolveUserDisplay(
    domain,
    platformProfile,
    clientProfile,
  );
  const userInitials = buildUserInitials(userName);
  const currentPageLabel = getCurrentPageLabel(location.pathname, navigationItems);

  const handleSessionExpired = () => {
    window.dispatchEvent(new CustomEvent(TOKEN_EXPIRED_EVENT));
    clearAuth();
  };

  const sidebarLeft = isMobile ? 0 : `${sidebarWidth}px`;
  const shouldRenderDesktopSidebar = !isMobile;
  const shouldRenderMobileDrawer = isMobile;
  const layoutContent = children ?? <Outlet />;

  const handleOpenProfilePage = () => {
    closeProfileMenu();
    void navigate(resolveProfilePathByDomain(domain));
  };

  const handleOpenNotificationsPage = () => {
    closeNotificationsMenu();
    if (domain === 'client') {
      void navigate('/client/notifications');
    }
  };

  if (sessionGate.blockingLabel !== null) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress aria-label={sessionGate.blockingLabel} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      <GlobalStyles styles={pageEnterStyles} />

      {shouldRenderDesktopSidebar ? (
        <Box
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            height: '100vh',
            borderRight: 1,
            borderColor: 'divider',
            transition: themeObj.transitions.create('width', {
              duration: themeObj.transitions.duration.shorter,
              easing: themeObj.transitions.easing.easeInOut,
            }),
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
          left: sidebarLeft,
          transition: themeObj.transitions.create('left'),
          zIndex: 40,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <TopBar
          appBarHeight={appBarHeight}
          isMobile={isMobile}
          currentPageLabel={currentPageLabel}
          userName={userName}
          userInitials={userInitials}
          userRole={userRole}
          sessionExpiresIn={session?.expiresIn}
          sessionAccessToken={session?.accessToken}
          onSessionExpired={handleSessionExpired}
          onOpenMobileMenu={openMobileMenu}
          onOpenCommandPalette={palette.open}
          onOpenNotificationsMenu={openNotificationsMenu}
          onOpenProfileMenu={openProfileMenu}
          unreadNotificationsCount={notificationCenter.unreadCount}
        />
      </Box>

      <Box
        component="main"
        ref={contentRef}
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflowY: 'auto',
          pt: `${appBarHeight + 24}px`,
          px: responsive({ xs: 2, lg: 3 }),
          pb: 3,
          animation: 'page-enter 220ms ease-out both',
        }}
      >
        <Suspense
          fallback={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
              }}
            >
              <CircularProgress aria-label="Carregando página" />
            </Box>
          }
        >
          {layoutContent}
        </Suspense>
      </Box>

      {shouldRenderMobileDrawer ? (
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
      ) : null}

      <NotificationsMenu
        anchorEl={notificationsAnchor}
        open={notificationsAnchor !== null}
        onClose={closeNotificationsMenu}
        notifications={notificationCenter.menuItems}
        loading={notificationCenter.loading}
        errorMessage={notificationCenter.errorMessage}
        onNotificationClick={(notificationId) => {
          void notificationCenter.markAsRead(notificationId);
        }}
        onMarkAllRead={() => {
          void notificationCenter.markAllVisibleAsRead();
        }}
        onViewAllNotifications={handleOpenNotificationsPage}
      />

      <ProfileMenu
        anchorEl={profileAnchor}
        open={profileAnchor !== null}
        onClose={closeProfileMenu}
        onProfile={handleOpenProfilePage}
        userName={userName}
        userInitials={userInitials}
        userEmail={userEmail}
        theme={theme}
        density={density}
        onSetTheme={setTheme}
        onSetDensity={setDensity}
        onLogout={sessionGate.handleLogout}
      />

      <CommandPalette
        key={palette.openKey}
        isOpen={palette.isOpen}
        favorites={palette.favorites}
        items={navigationItems}
        onClose={palette.close}
        onToggleFavorite={palette.toggleFavorite}
      />

      <AppSnackbar
        open={notificationCenter.snackbarMessage !== undefined}
        message={notificationCenter.snackbarMessage}
        severity="info"
        onClose={notificationCenter.clearSnackbar}
      />
    </Box>
  );
};
