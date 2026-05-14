import type { ReactNode } from 'react';
import { ForbiddenState } from '@app/guards/ForbiddenState';

interface PermissionGateProps {
  allowed: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGate = ({
  allowed,
  children,
  fallback = <ForbiddenState />,
}: PermissionGateProps) => (allowed ? <>{children}</> : <>{fallback}</>);
