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
  'platform:clients:read',
  'platform:clients:create',
  'platform:clients:update',
  'platform:clients:delete',
  'platform:plans:read',
  'platform:plans:create',
  'platform:plans:update',
  'platform:plans:delete',
  'platform:subscriptions:read',
  'platform:subscriptions:create',
  'platform:subscriptions:update',
  'platform:subscriptions:delete',
];

const clientDefaultPermissions = [
  'dashboard:read',
  'panel:read',
  'users:read',
  'users:create',
  'users:update',
  'users:delete',
  'roles:read',
  'roles:create',
  'roles:update',
  'roles:delete',
  'finance:read',
  'finance:create',
  'finance:update',
  'finance:delete',
  'reports:read',
  'academic-year:read',
  'academic-year:create',
  'academic-year:update',
  'academic-year:delete',
  'education-level:read',
  'education-level:create',
  'education-level:update',
  'education-level:delete',
  'grade:read',
  'grade:create',
  'grade:update',
  'grade:delete',
  'school-class:read',
  'school-class:create',
  'school-class:update',
  'school-class:delete',
  'subject:read',
  'subject:create',
  'subject:update',
  'subject:delete',
  'teacher-subject:read',
  'teacher-subject:create',
  'teacher-subject:delete',
  'employees:read',
  'employees:create',
  'employees:update',
  'employees:delete',
  'student:read',
  'student:create',
  'student:update',
  'student:delete',
  'student-enroll:read',
  'student-enroll:create',
  'student-enroll:update',
  'student-enroll:delete',
  'attendance:read',
  'attendance:write',
  'documents:read',
  'documents:delete',
  'report-card:read',
  'report-card:write',
];

export const hasPermission = (permissions: string[], requiredPermission: string): boolean => {
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
