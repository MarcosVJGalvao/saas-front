import { lazy, Suspense } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DomainProtectedRoute } from './components/common/access/DomainProtectedRoute';
import { AppLayout } from './components/layout/admin-navigation/AppLayout';
import { AUTH_DOMAIN } from './models/auth/auth';

const PlatformLoginPage = lazy(() => import('./pages/platform/auth/LoginPage'));
const PlatformMfaPage = lazy(() => import('./pages/platform/auth/MfaPage'));
const PlatformMfaSetupPage = lazy(() => import('./pages/platform/auth/MfaSetupPage'));
const PlatformDashboardPage = lazy(() => import('./pages/platform/dashboard/DashboardPage'));
const PlatformHomePage = lazy(() => import('./pages/platform/home/HomePage'));
const ClientLoginPage = lazy(() => import('./pages/client/auth/LoginPage'));
const ClientForgotPasswordPage = lazy(() => import('./pages/client/auth/ForgotPasswordPage'));
const ClientResetPasswordPage = lazy(() => import('./pages/client/auth/ResetPasswordPage'));
const ClientDashboardPage = lazy(() => import('./pages/client/dashboard/DashboardPage'));
const ClientHomePage = lazy(() => import('./pages/client/home/HomePage'));

const App = () => (
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
);

export default App;
