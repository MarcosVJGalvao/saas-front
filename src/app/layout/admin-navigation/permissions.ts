import type { AuthDomain } from '@shared/types/auth/auth';
import type { NavigationItem } from '@shared/types/navigation';

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
  'platform:plans:*',
  'platform:subscriptions:*',
];

const clientDefaultPermissions = [
  'client:dashboard:read',
  'client:panel:read',
  'client:users:read',
  'client:roles:read',
  'client:finance:read',
  'client:reports:read',
  'client:academic-year:read',
  'client:education-level:read',
  'client:grade:read',
  'client:school-class:read',
  'client:subject:read',
  'client:teacher-subject:read',
  'client:student:read',
  'client:student-enroll:*',
  'client:legal-guardian:read',
  'client:attendance:read',
  'client:documents:read',
  'client:report-card:read',
];

const hasPermission = (permissions: string[], requiredPermission: string): boolean => {
  if (permissions.includes('*:*')) {
    return true;
  }

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

const filterChildrenByPermissions = (
  item: NavigationItem,
  permissions: string[],
): NavigationItem | null => {
  if (item.type !== 'section' && !hasPermission(permissions, item.permission)) {
    return null;
  }

  const filteredChildren = item.children
    ?.filter((child) => hasPermission(permissions, child.permission))
    .map((child) => ({
      ...child,
      children: child.children?.filter((grandchild) =>
        hasPermission(permissions, grandchild.permission),
      ),
    }));

  return {
    ...item,
    children: filteredChildren,
  };
};

const pushSectionBlock = (
  result: NavigationItem[],
  currentSection: NavigationItem | null,
  sectionItems: NavigationItem[],
): void => {
  if (currentSection === null) {
    result.push(...sectionItems);
    return;
  }

  if (sectionItems.length > 0) {
    result.push(currentSection, ...sectionItems);
  }
};

export const filterNavigationByPermissions = (
  items: NavigationItem[],
  permissions: string[],
): NavigationItem[] => {
  const result: NavigationItem[] = [];
  let currentSection: NavigationItem | null = null;
  let sectionItems: NavigationItem[] = [];

  for (const item of items) {
    if (item.type === 'section') {
      pushSectionBlock(result, currentSection, sectionItems);
      currentSection = item;
      sectionItems = [];
      continue;
    }

    const filteredItem = filterChildrenByPermissions(item, permissions);

    if (filteredItem !== null) {
      sectionItems.push(filteredItem);
    }
  }

  pushSectionBlock(result, currentSection, sectionItems);

  return result;
};
