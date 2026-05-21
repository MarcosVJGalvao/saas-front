import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { NavigationItem } from '@shared/types/navigation';
import { useSidebarContentState } from '@shared/hooks/useSidebarContentState';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const module = await vi.importActual('react-router-dom');
  return {
    ...module,
    useNavigate: () => navigateMock,
  };
});

const usersWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/users']}>{children}</MemoryRouter>
);

const dashboardWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/dashboard']}>{children}</MemoryRouter>
);

const items: NavigationItem[] = [
  {
    id: 'users',
    label: 'Usuários',
    permission: 'users:read',
    children: [
      {
        id: 'users-management',
        label: 'Gestão de usuários',
        permission: 'users:read',
        children: [{ id: 'users-list', label: 'Lista', href: '/users', permission: 'users:read' }],
      },
    ],
  },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', permission: 'dashboard:read' },
];

describe('useSidebarContentState', () => {
  it('abre grupo e subgrupo quando a rota filha está ativa', () => {
    const { result } = renderHook(() => useSidebarContentState(items), { wrapper: usersWrapper });

    const usersItem = result.current.mappedItems.find((item) => item.id === 'users');
    expect(usersItem?.isOpen).toBe(true);
    expect(usersItem?.children?.[0]?.isOpen).toBe(true);
  });

  it('permite toggle manual em grupo inativo', () => {
    const { result } = renderHook(() => useSidebarContentState(items), {
      wrapper: dashboardWrapper,
    });

    const usersItem = result.current.mappedItems.find((item) => item.id === 'users');
    expect(usersItem?.isOpen).toBe(false);

    act(() => {
      result.current.toggleGroup('users');
    });

    const usersItemAfterToggle = result.current.mappedItems.find((item) => item.id === 'users');
    expect(usersItemAfterToggle?.isOpen).toBe(true);
  });

  it('navega e fecha menu mobile quando clica em item', () => {
    const closeMobile = vi.fn();
    const { result } = renderHook(() => useSidebarContentState(items, closeMobile), {
      wrapper: usersWrapper,
    });

    act(() => {
      result.current.onItemClick('/dashboard');
    });

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    expect(closeMobile).toHaveBeenCalled();
  });
});
