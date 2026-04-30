import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AUTH_FLOW_STEP, type AuthDomain } from '../../../models/auth/auth';
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
  const isAuthenticatedForDomain =
    session !== null && authDomain === domain && flowStep === AUTH_FLOW_STEP.AUTHENTICATED;

  return isAuthenticatedForDomain ? children : <Navigate to={loginPath} replace />;
};
