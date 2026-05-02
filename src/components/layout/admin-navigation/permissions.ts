import type { AuthDomain } from '../../../models/auth/auth';
import type { NavigationItem } from '../../../models/navigation';

export interface PermissionResolver {
  getPermissions: (domain: AuthDomain) => string[];
}

const platformDefaultPermissions = [
  'platform:dashboard:read',
  'platform:panel:read',
  'platform:users:read',
  'platform:roles:read',
  'platform:groups:read',
  'platform:invites:read',
  'platform:access-logs:read',
  'platform:registry:read',
  'platform:finance:read',
  'platform:reports:read',
  'platform:settings:read',
  'platform:audit:read',
  'platform:clients:*',
];

const clientDefaultPermissions = [
  'client:dashboard:read',
  'client:panel:read',
  'client:users:read',
  'client:finance:read',
  'client:reports:read',
];

const hasPermission = (permissions: string[], requiredPermission: string): boolean => {
  if (permissions.includes(requiredPermission)) {
    return true;
  }

  const [context, resource] = requiredPermission.split(':');
  const contextWildcard = `${context}:*`;
  const resourceWildcard = `${context}:${resource}:*`;

  return permissions.includes(contextWildcard) || permissions.includes(resourceWildcard);
};

export const localPermissionResolver: PermissionResolver = {
  getPermissions: (domain) =>
    domain === 'platform' ? platformDefaultPermissions : clientDefaultPermissions,
};

export const filterNavigationByPermissions = (
  items: NavigationItem[],
  permissions: string[],
): NavigationItem[] => {
  return items
    .filter((item) => hasPermission(permissions, item.permission))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => hasPermission(permissions, child.permission)),
    }));
};
