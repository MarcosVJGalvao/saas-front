import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { NavigationItem } from '@shared/types/navigation';
import { useCommandPaletteView } from '@shared/hooks/useCommandPaletteView';

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

const CommandPaletteKeydownHarness = ({ onClose }: { onClose: () => void }) => {
  const view = useCommandPaletteView('dash', 'dash', [], items, onClose);

  return <input aria-label="Busca" onKeyDown={view.onKeyDown} />;
};

const items: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', permission: 'dashboard:read' },
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
];

describe('useCommandPaletteView', () => {
  it('filtra itens por query', () => {
    const { result } = renderHook(() => useCommandPaletteView('dash', 'dash', [], items, vi.fn()), {
      wrapper,
    });

    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0]?.id).toBe('dashboard');
  });

  it('inclui destinos do terceiro nível na busca', () => {
    const { result } = renderHook(
      () => useCommandPaletteView('lista', 'lista', [], items, vi.fn()),
      {
        wrapper,
      },
    );

    expect(result.current.filteredItems).toEqual([
      expect.objectContaining({
        id: 'users-list',
        href: '/users',
      }),
    ]);
  });

  it('retorna todos os itens quando query está vazia', () => {
    const { result } = renderHook(() => useCommandPaletteView('', '', [], items, vi.fn()), {
      wrapper,
    });

    expect(result.current.filteredItems.length).toBeGreaterThan(0);
  });

  it('navega no enter e fecha palette', () => {
    const onClose = vi.fn();

    render(
      <MemoryRouter>
        <CommandPaletteKeydownHarness onClose={onClose} />
      </MemoryRouter>,
    );

    fireEvent.keyDown(screen.getByLabelText('Busca'), { key: 'Enter' });

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    expect(onClose).toHaveBeenCalled();
  });
});
