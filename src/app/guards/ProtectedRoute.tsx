import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectTo?: string;
  children: ReactNode;
}

export const ProtectedRoute = ({
  isAuthenticated,
  redirectTo = '/login',
  children,
}: ProtectedRouteProps) => (isAuthenticated ? children : <Navigate to={redirectTo} replace />);
