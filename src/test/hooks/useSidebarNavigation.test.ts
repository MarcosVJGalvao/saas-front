import { describe, expect, it } from 'vitest';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';
import { navigationByDomain } from '@app/layout/admin-navigation/config';
import {
  buildDomainNavigation,
  type NavigationGroup,
} from '@app/layout/admin-navigation/navigationBuilder';
import { filterNavigationByPermissions } from '@app/layout/admin-navigation/permissions';

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
  });

  it('applies prefix and domain permission during build', () => {
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
    expect(firstItem.href).toBe('/client/home');
    expect(firstItem.permission).toBe('client:dashboard:read');
  });

  it('hides a section when no subsequent item is permitted', () => {
    const items = navigationByDomain.platform;
    const filtered = filterNavigationByPermissions(items, ['platform:dashboard:read']);

    expect(filtered.some((item) => item.type === 'section' && item.label === 'Gestão')).toBe(false);
    expect(filtered.some((item) => item.id === 'dashboard')).toBe(true);
  });

  it('keeps a section when at least one subsequent item is permitted', () => {
    const items = navigationByDomain.platform;
    const filtered = filterNavigationByPermissions(items, [
      'platform:dashboard:read',
      'platform:clients:read',
    ]);

    expect(filtered.some((item) => item.type === 'section' && item.label === 'Gestão')).toBe(true);
    expect(filtered.some((item) => item.id === 'clientes')).toBe(true);
  });
});
