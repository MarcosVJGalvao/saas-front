import type { ReactNode } from 'react';

interface PermissionGateProps {
  allowed: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({ allowed, children, fallback = null }: PermissionGateProps) =>
  allowed ? <>{children}</> : <>{fallback}</>;
