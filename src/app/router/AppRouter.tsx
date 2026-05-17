import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DomainProtectedRoute } from '@app/guards/DomainProtectedRoute';
import { SessionExpiredDialog } from '@shared/components/feedback/SessionExpiredDialog';
import { AppLayout } from '@app/layout/admin-navigation/AppLayout';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';

const PublicHomePage = lazy(() => import('@/pages/HomePage'));
const PlatformLoginPage = lazy(() => import('@features/platform/auth/pages/LoginPage'));
const PlatformMfaPage = lazy(() => import('@features/platform/auth/pages/MfaPage'));
const PlatformMfaSetupPage = lazy(() => import('@features/platform/auth/pages/MfaSetupPage'));
const PlatformDashboardPage = lazy(
  () => import('@features/platform/dashboard/pages/DashboardPage'),
);
const PlatformHomePage = lazy(() => import('@features/platform/home/pages/HomePage'));
const ClientsListPage = lazy(() => import('@features/platform/clients/pages/ClientsListPage'));
const ClientCreatePage = lazy(() => import('@features/platform/clients/pages/ClientCreatePage'));
const ClientEditPage = lazy(() => import('@features/platform/clients/pages/ClientEditPage'));
const ClientDetailsPage = lazy(() => import('@features/platform/clients/pages/ClientDetailsPage'));
const ClientOnboardingPage = lazy(
  () => import('@features/platform/clients/pages/ClientOnboardingPage'),
);
const PlansListPage = lazy(() => import('@features/platform/plans/pages/PlansListPage'));
const PlanCreatePage = lazy(() => import('@features/platform/plans/pages/PlanCreatePage'));
const PlanEditPage = lazy(() => import('@features/platform/plans/pages/PlanEditPage'));
const PlanDetailsPage = lazy(() => import('@features/platform/plans/pages/PlanDetailsPage'));
const SubscriptionsListPage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionsListPage'),
);
const SubscriptionCreatePage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionCreatePage'),
);
const SubscriptionEditPage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionEditPage'),
);
const SubscriptionDetailsPage = lazy(
  () => import('@features/platform/subscriptions/pages/SubscriptionDetailsPage'),
);
const ClientLoginPage = lazy(() => import('@features/client/auth/pages/LoginPage'));
const ClientForgotPasswordPage = lazy(
  () => import('@features/client/auth/pages/ForgotPasswordPage'),
);
const ClientResetPasswordPage = lazy(() => import('@features/client/auth/pages/ResetPasswordPage'));
const ClientDashboardPage = lazy(() => import('@features/client/dashboard/pages/DashboardPage'));
const ClientHomePage = lazy(() => import('@features/client/home/pages/HomePage'));

const TOKEN_EXPIRED_EVENT = 'app:token-expired';

const resolveLoginPathByCurrentLocation = (): string =>
  window.location.pathname.startsWith('/client') ? '/client/login' : '/platform/login';

const authFallback = (
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
);

const SuspendedPage = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={authFallback}>{children}</Suspense>
);

const ProtectedPlatformRoute = ({ children }: { children: ReactNode }) => (
  <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
    {children}
  </DomainProtectedRoute>
);

const ProtectedClientRoute = ({ children }: { children: ReactNode }) => (
  <DomainProtectedRoute domain={AUTH_DOMAIN.CLIENT} loginPath="/client/login">
    {children}
  </DomainProtectedRoute>
);

export const AppRouter = () => {
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
    <BrowserRouter>
      <Routes>
        <Route
          path="/platform/login"
          element={
            <SuspendedPage>
              <PlatformLoginPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/platform/mfa"
          element={
            <SuspendedPage>
              <PlatformMfaPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/platform/mfa-setup"
          element={
            <SuspendedPage>
              <PlatformMfaSetupPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/client/login"
          element={
            <SuspendedPage>
              <ClientLoginPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/client/forgot-password"
          element={
            <SuspendedPage>
              <ClientForgotPasswordPage />
            </SuspendedPage>
          }
        />
        <Route
          path="/client/reset-password"
          element={
            <SuspendedPage>
              <ClientResetPasswordPage />
            </SuspendedPage>
          }
        />

        <Route element={<AppLayout />}>
          <Route
            path="/platform/home"
            element={
              <ProtectedPlatformRoute>
                <PlatformHomePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients"
            element={
              <ProtectedPlatformRoute>
                <ClientsListPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/new"
            element={
              <ProtectedPlatformRoute>
                <ClientCreatePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/onboarding"
            element={
              <ProtectedPlatformRoute>
                <ClientOnboardingPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/:id"
            element={
              <ProtectedPlatformRoute>
                <ClientDetailsPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/clients/:id/edit"
            element={
              <ProtectedPlatformRoute>
                <ClientEditPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans"
            element={
              <ProtectedPlatformRoute>
                <PlansListPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans/new"
            element={
              <ProtectedPlatformRoute>
                <PlanCreatePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans/:id"
            element={
              <ProtectedPlatformRoute>
                <PlanDetailsPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/plans/:id/edit"
            element={
              <ProtectedPlatformRoute>
                <PlanEditPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionsListPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions/new"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionCreatePage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions/:id"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionDetailsPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform/subscriptions/:id/edit"
            element={
              <ProtectedPlatformRoute>
                <SubscriptionEditPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/platform"
            element={
              <ProtectedPlatformRoute>
                <PlatformDashboardPage />
              </ProtectedPlatformRoute>
            }
          />
          <Route
            path="/client/home"
            element={
              <ProtectedClientRoute>
                <ClientHomePage />
              </ProtectedClientRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ProtectedClientRoute>
                <ClientDashboardPage />
              </ProtectedClientRoute>
            }
          />
        </Route>

        <Route
          path="/"
          element={
            <SuspendedPage>
              <PublicHomePage />
            </SuspendedPage>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <SessionExpiredDialog
        open={sessionExpiredModalOpen}
        onClose={handleCloseSessionExpiredModal}
      />
    </BrowserRouter>
  );
};
