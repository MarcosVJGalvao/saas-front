import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { NavigationItem } from '../../models/navigation';
import { useCommandPaletteView } from '../../hooks/useCommandPaletteView';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const module = await vi.importActual('react-router-dom');
  return {
    ...module,
    useNavigate: () => navigateMock,
  };
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

const items: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', permission: 'dashboard:read' },
  {
    id: 'users',
    label: 'Usuarios',
    permission: 'users:read',
    children: [{ id: 'users-list', label: 'Lista', href: '/users', permission: 'users:read' }],
  },
];

describe('useCommandPaletteView', () => {
  it('filtra itens por query e tab', () => {
    const { result } = renderHook(() => useCommandPaletteView('dash', [], items, vi.fn()), {
      wrapper,
    });

    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0]?.id).toBe('dashboard');

    act(() => {
      result.current.setActiveTab('users');
    });

    expect(result.current.filteredItems).toHaveLength(0);
  });

  it('navega no enter e fecha palette', () => {
    const onClose = vi.fn();
    const { result } = renderHook(() => useCommandPaletteView('dash', [], items, onClose), {
      wrapper,
    });

    act(() => {
      result.current.onKeyDown({
        key: 'Enter',
        preventDefault: vi.fn(),
      } as unknown as React.KeyboardEvent);
    });

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    expect(onClose).toHaveBeenCalled();
  });
});
