import { lazy, Suspense, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DomainProtectedRoute } from './components/common/access/DomainProtectedRoute';
import { SessionExpiredDialog } from './components/common/feedback/SessionExpiredDialog';
import { AppLayout } from './components/layout/admin-navigation/AppLayout';
import { AUTH_DOMAIN } from './models/auth/auth';

const PlatformLoginPage = lazy(() => import('./pages/platform/auth/LoginPage'));
const PlatformMfaPage = lazy(() => import('./pages/platform/auth/MfaPage'));
const PlatformMfaSetupPage = lazy(() => import('./pages/platform/auth/MfaSetupPage'));
const PlatformDashboardPage = lazy(() => import('./pages/platform/dashboard/DashboardPage'));
const PlatformHomePage = lazy(() => import('./pages/platform/home/HomePage'));
const ClientsListPage = lazy(() => import('./pages/platform/clients/ClientsListPage'));
const ClientCreatePage = lazy(() => import('./pages/platform/clients/ClientCreatePage'));
const ClientEditPage = lazy(() => import('./pages/platform/clients/ClientEditPage'));
const ClientDetailsPage = lazy(() => import('./pages/platform/clients/ClientDetailsPage'));
const ClientOnboardingPage = lazy(() => import('./pages/platform/clients/ClientOnboardingPage'));
const ClientLoginPage = lazy(() => import('./pages/client/auth/LoginPage'));
const ClientForgotPasswordPage = lazy(() => import('./pages/client/auth/ForgotPasswordPage'));
const ClientResetPasswordPage = lazy(() => import('./pages/client/auth/ResetPasswordPage'));
const ClientDashboardPage = lazy(() => import('./pages/client/dashboard/DashboardPage'));
const ClientHomePage = lazy(() => import('./pages/client/home/HomePage'));
const TOKEN_EXPIRED_EVENT = 'app:token-expired';

const resolveLoginPathByCurrentLocation = (): string =>
  window.location.pathname.startsWith('/client') ? '/client/login' : '/platform/login';

const App = () => {
  const [sessionExpiredModalOpen, setSessionExpiredModalOpen] = useState(false);

  useEffect(() => {
    const onTokenExpired = () => {
      setSessionExpiredModalOpen(true);
    };

    window.addEventListener(TOKEN_EXPIRED_EVENT, onTokenExpired);
    return () => window.removeEventListener(TOKEN_EXPIRED_EVENT, onTokenExpired);
  }, []);

  const handleCloseSessionExpiredModal = () => {
    setSessionExpiredModalOpen(false);
    window.location.assign(resolveLoginPathByCurrentLocation());
  };

  return (
    <>
      <Suspense
        fallback={
          <Box
            sx={{
              minHeight: '100dvh',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress aria-label="Carregando" />
          </Box>
        }
      >
        <Routes>
          <Route path="/platform/login" element={<PlatformLoginPage />} />
          <Route path="/platform/mfa" element={<PlatformMfaPage />} />
          <Route path="/platform/mfa-setup" element={<PlatformMfaSetupPage />} />
          <Route path="/client/login" element={<ClientLoginPage />} />
          <Route path="/client/forgot-password" element={<ClientForgotPasswordPage />} />
          <Route path="/client/reset-password" element={<ClientResetPasswordPage />} />

          <Route element={<AppLayout />}>
            <Route
              path="/platform/home"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
                  <PlatformHomePage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/platform/clients"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
                  <ClientsListPage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/platform/clients/new"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
                  <ClientCreatePage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/platform/clients/onboarding"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
                  <ClientOnboardingPage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/platform/clients/:id"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
                  <ClientDetailsPage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/platform/clients/:id/edit"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
                  <ClientEditPage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/platform"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
                  <PlatformDashboardPage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/client/home"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.CLIENT} loginPath="/client/login">
                  <ClientHomePage />
                </DomainProtectedRoute>
              }
            />
            <Route
              path="/client"
              element={
                <DomainProtectedRoute domain={AUTH_DOMAIN.CLIENT} loginPath="/client/login">
                  <ClientDashboardPage />
                </DomainProtectedRoute>
              }
            />
          </Route>

          <Route path="/" element={<Navigate to="/platform/login" replace />} />
          <Route path="*" element={<Navigate to="/platform/login" replace />} />
        </Routes>
      </Suspense>

      <SessionExpiredDialog
        open={sessionExpiredModalOpen}
        onClose={handleCloseSessionExpiredModal}
      />
    </>
  );
};

export default App;
