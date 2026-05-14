import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import type { AuthDomain } from '@shared/types/auth/auth';
import { isAuthenticatedForDomain } from '@shared/types/auth/guards';

interface DomainProtectedRouteProps {
  domain: AuthDomain;
  loginPath: string;
  children: ReactNode;
}

export const DomainProtectedRoute = ({
  domain,
  loginPath,
  children,
}: DomainProtectedRouteProps) => {
  const { session, authDomain, flowStep } = useAuth();
  const isAuthenticated = isAuthenticatedForDomain(authDomain, flowStep, session, domain);

  return isAuthenticated ? children : <Navigate to={loginPath} replace />;
};
