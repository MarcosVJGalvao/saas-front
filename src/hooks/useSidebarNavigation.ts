import { useMemo } from 'react';
import type { AuthDomain } from '../models/auth/auth';
import { navigationByDomain } from '../components/layout/admin-navigation/config';
import {
  filterNavigationByPermissions,
  localPermissionResolver,
} from '../components/layout/admin-navigation/permissions';

export const useSidebarNavigation = (authDomain: AuthDomain | null) => {
  const domain = authDomain ?? 'platform';

  const navigationItems = useMemo(() => {
    const permissions = localPermissionResolver.getPermissions(domain);
    return filterNavigationByPermissions(navigationByDomain[domain], permissions);
  }, [domain]);

  return {
    domain,
    navigationItems,
  };
};
