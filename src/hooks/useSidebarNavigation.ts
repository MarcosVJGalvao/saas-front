import type { AuthDomain } from '../models/auth/auth';
import { navigationByDomain } from '../components/layout/admin-navigation/config';
import {
  filterNavigationByPermissions,
  localPermissionResolver,
} from '../components/layout/admin-navigation/permissions';

export interface UseSidebarNavigationOptions {
  platformPermissions?: string[];
  clientPermissions?: string[];
}

export const useSidebarNavigation = (
  authDomain: AuthDomain | null,
  options?: UseSidebarNavigationOptions,
) => {
  const domain = authDomain ?? 'platform';
  const permissions =
    domain === 'platform' && options?.platformPermissions !== undefined
      ? options.platformPermissions
      : domain === 'client' && options?.clientPermissions !== undefined
        ? options.clientPermissions
        : localPermissionResolver.getPermissions(domain);
  const navigationItems = filterNavigationByPermissions(navigationByDomain[domain], permissions);

  return {
    domain,
    navigationItems,
  };
};
