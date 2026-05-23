import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlatformProfilePage from '@features/platform/profile/pages/PlatformProfilePage';
import { usePlatformProfilePage } from '@features/platform/profile/hooks/usePlatformProfilePage';

vi.mock('@features/platform/profile/hooks/usePlatformProfilePage', () => ({
  usePlatformProfilePage: vi.fn(),
}));

describe('PlatformProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza estado vazio', () => {
    vi.mocked(usePlatformProfilePage).mockReturnValue({
      viewState: 'empty',
      data: { headerData: null, tabs: [] },
      errorMessage: '',
      onBack: vi.fn(),
      onRetry: vi.fn(),
    });

    render(<PlatformProfilePage />);

    expect(screen.getByText('Perfil indisponível')).toBeInTheDocument();
  });

  it('renderiza perfil pronto', () => {
    vi.mocked(usePlatformProfilePage).mockReturnValue({
      viewState: 'ready',
      data: {
        headerData: {
          title: 'Administrador',
          subtitle: 'admin@sistema.com',
          avatarFallback: 'AD',
          statusLabel: 'Ativo',
          statusColor: 'success',
        },
        tabs: [
          {
            id: 'summary',
            label: 'Resumo',
            sections: [
              {
                id: 'access',
                title: 'Papéis e acesso',
                items: [{ label: 'Papéis', value: 'Administrador' }],
              },
            ],
          },
        ],
        footerActions: [
          {
            id: 'change-password',
            label: 'Alterar senha',
            onClick: vi.fn(),
          },
        ],
      },
      errorMessage: '',
      onBack: vi.fn(),
      onRetry: vi.fn(),
    });

    render(<PlatformProfilePage />);

    expect(screen.getAllByText('Administrador').length).toBeGreaterThan(0);
    expect(screen.getByText('Papéis e acesso')).toBeInTheDocument();
    expect(screen.getByText('Alterar senha')).toBeInTheDocument();
  });
});
