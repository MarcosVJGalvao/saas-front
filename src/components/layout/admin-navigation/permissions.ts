import type { AuthDomain } from '../../../models/auth/auth';
import type { NavigationItem } from '../../../models/navigation';

export interface PermissionResolver {
  getPermissions: (domain: AuthDomain) => string[];
}

const platformDefaultPermissions = [
  'dashboard:read',
  'panel:read',
  'users:read',
  'roles:read',
  'groups:read',
  'invites:read',
  'access-logs:read',
  'registry:read',
  'finance:read',
  'reports:read',
  'settings:read',
  'audit:read',
];

const clientDefaultPermissions = [
  'dashboard:read',
  'panel:read',
  'users:read',
  'finance:read',
  'reports:read',
];

export const localPermissionResolver: PermissionResolver = {
  getPermissions: (domain) =>
    domain === 'platform' ? platformDefaultPermissions : clientDefaultPermissions,
};

export const filterNavigationByPermissions = (
  items: NavigationItem[],
  permissions: string[],
): NavigationItem[] => {
  const allowedSet = new Set(permissions);

  return items
    .filter((item) => allowedSet.has(item.permission))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => allowedSet.has(child.permission)),
    }));
};
