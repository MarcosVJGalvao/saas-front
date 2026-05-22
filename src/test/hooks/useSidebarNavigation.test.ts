import { describe, expect, it } from 'vitest';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';
import { navigationByDomain } from '@app/layout/admin-navigation/config';
import {
  buildDomainNavigation,
  type NavigationGroup,
} from '@app/layout/admin-navigation/navigationBuilder';
import {
  filterNavigationByPermissions,
  localPermissionResolver,
} from '@app/layout/admin-navigation/permissions';

describe('admin navigation by domain', () => {
  it('builds platform and client menus with distinct groups', () => {
    const platformItems = navigationByDomain.platform;
    const clientItems = navigationByDomain.client;

    expect(platformItems.some((item) => item.type === 'section' && item.label === 'Gestão')).toBe(
      true,
    );
    expect(clientItems.some((item) => item.type === 'section' && item.label === 'Gestão')).toBe(
      false,
    );
    expect(
      clientItems.some((item) => item.type === 'section' && item.label === 'Administração'),
    ).toBe(true);
    expect(
      clientItems.some(
        (item) => item.id === 'client-academic-structure' && item.children !== undefined,
      ),
    ).toBe(true);
  });

  it('applies route prefix and keeps client permission without domain prefix', () => {
    const groups: NavigationGroup[] = [
      {
        items: [
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/home',
            permission: 'dashboard:read',
          },
        ],
      },
    ];

    const built = buildDomainNavigation(groups, '/client', AUTH_DOMAIN.CLIENT);

    expect(built).toHaveLength(1);
    const firstItem = built[0];
    if (firstItem === undefined) {
      throw new Error('Item de navegação não encontrado.');
    }
    expect(firstItem.id).toBe('client-dashboard');
    expect(firstItem.href).toBe('/client/home');
    expect(firstItem.permission).toBe('dashboard:read');
  });

  it('hides a section when no subsequent item is permitted', () => {
    const items = navigationByDomain.platform;
    const filtered = filterNavigationByPermissions(items, ['platform:dashboard:read']);

    expect(filtered.some((item) => item.type === 'section' && item.label === 'Gestão')).toBe(false);
    expect(filtered.some((item) => item.id === 'platform-dashboard')).toBe(true);
  });

  it('keeps a section when at least one subsequent item is permitted', () => {
    const items = navigationByDomain.platform;
    const filtered = filterNavigationByPermissions(items, [
      'platform:dashboard:read',
      'platform:clients:read',
    ]);

    expect(filtered.some((item) => item.type === 'section' && item.label === 'Gestão')).toBe(true);
    expect(filtered.some((item) => item.id === 'platform-clientes')).toBe(true);
  });

  it('keeps expandable parents when only a nested child is permitted', () => {
    const items = navigationByDomain.client;
    const filtered = filterNavigationByPermissions(items, ['student-enroll:read']);
    const registrationGroup = filtered.find((item) => item.id === 'client-students-registration');

    expect(filtered.some((item) => item.type === 'section' && item.label === 'Alunos')).toBe(true);
    expect(registrationGroup?.children).toEqual([
      expect.objectContaining({
        id: 'client-student-enrollments',
        label: 'Matrículas',
      }),
    ]);
  });

  it('does not use wildcard permissions in local client defaults', () => {
    const permissions = localPermissionResolver.getPermissions(AUTH_DOMAIN.CLIENT);

    expect(permissions.some((permission) => permission.includes('*'))).toBe(false);
    expect(permissions).toContain('student:read');
    expect(permissions).toContain('student:create');
    expect(permissions).toContain('student:update');
    expect(permissions).toContain('student:delete');
    expect(permissions).toContain('attendance:create');
    expect(permissions).toContain('attendance:update');
    expect(permissions).toContain('attendance:delete');
  });
});
