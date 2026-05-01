import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { NavigationItem } from '../../models/navigation';
import { useSidebarContentState } from '../../hooks/useSidebarContentState';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const module = await vi.importActual('react-router-dom');
  return {
    ...module,
    useNavigate: () => navigateMock,
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={['/users']}>{children}</MemoryRouter>
);

const items: NavigationItem[] = [
  {
    id: 'users',
    label: 'Usuarios',
    permission: 'users:read',
    children: [{ id: 'users-list', label: 'Lista', href: '/users', permission: 'users:read' }],
  },
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', permission: 'dashboard:read' },
];

describe('useSidebarContentState', () => {
  it('mapeia estado de grupo e toggle', () => {
    const { result } = renderHook(() => useSidebarContentState(items), { wrapper });

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
    const { result } = renderHook(() => useSidebarContentState(items, closeMobile), { wrapper });

    act(() => {
      result.current.onItemClick('/dashboard');
    });

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    expect(closeMobile).toHaveBeenCalled();
  });
});
