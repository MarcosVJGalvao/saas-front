import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { AuthDomain } from '../../../models/auth/auth';
import { isAuthenticatedForDomain } from '../../../models/auth/guards';
import { useAuth } from '../../../hooks/useAuth/useAuth';

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
