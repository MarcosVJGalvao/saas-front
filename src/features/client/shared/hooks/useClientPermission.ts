import { hasPermission, localPermissionResolver } from '@app/layout/admin-navigation/permissions';

export const useClientPermission = () => {
  const permissions = localPermissionResolver.getPermissions('client');

  return {
    can: (permission: string): boolean => hasPermission(permissions, permission),
  };
};
