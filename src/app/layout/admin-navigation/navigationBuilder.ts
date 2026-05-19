import type { AuthDomain } from '@shared/types/auth/auth';
import type { NavigationItem, NavigationSectionItem } from '@shared/types/navigation';

export interface NavigationGroup {
  section?: { id: string; label: string };
  items: NavigationItem[];
}

export const makeSectionItem = (id: string, label: string): NavigationSectionItem => ({
  id,
  label,
  permission: '',
  type: 'section',
});

export const flattenGroups = (groups: NavigationGroup[]): NavigationItem[] =>
  groups.flatMap(({ section, items }) =>
    section ? [makeSectionItem(section.id, section.label), ...items] : items,
  );

export const buildPermission = (domain: AuthDomain, permission: string): string => {
  if (permission === '') return '';
  return domain === 'platform' ? `${domain}:${permission}` : permission;
};

export const mapItemWithPrefix = (
  item: NavigationItem,
  prefix: string,
  domain: AuthDomain,
): NavigationItem => ({
  ...item,
  id: `${domain}-${item.id}`,
  href: item.href ? `${prefix}${item.href}` : undefined,
  permission: buildPermission(domain, item.permission),
  children: item.children?.map((child) => ({
    ...child,
    id: `${domain}-${child.id}`,
    href: child.href ? `${prefix}${child.href}` : undefined,
    permission: buildPermission(domain, child.permission),
    children: child.children?.map((grandchild) => ({
      ...grandchild,
      id: `${domain}-${grandchild.id}`,
      href: grandchild.href ? `${prefix}${grandchild.href}` : undefined,
      permission: buildPermission(domain, grandchild.permission),
    })),
  })),
});

export const buildDomainNavigation = (
  groups: NavigationGroup[],
  prefix: string,
  domain: AuthDomain,
): NavigationItem[] => flattenGroups(groups).map((item) => mapItemWithPrefix(item, prefix, domain));
