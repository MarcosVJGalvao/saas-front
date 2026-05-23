import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClientProfilePage from '@features/client/profile/pages/ClientProfilePage';
import { useClientProfilePage } from '@features/client/profile/hooks/useClientProfilePage';

vi.mock('@features/client/profile/hooks/useClientProfilePage', () => ({
  useClientProfilePage: vi.fn(),
}));

describe('ClientProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza estado de erro', () => {
    vi.mocked(useClientProfilePage).mockReturnValue({
      viewState: 'error',
      data: { headerData: null, tabs: [] },
      errorMessage: 'Erro ao carregar perfil.',
      onBack: vi.fn(),
      onRetry: vi.fn(),
    });

    render(<ClientProfilePage />);

    expect(screen.getByText('Meu perfil')).toBeInTheDocument();
    expect(screen.getByText('Erro ao carregar perfil.')).toBeInTheDocument();
  });

  it('renderiza perfil pronto', () => {
    vi.mocked(useClientProfilePage).mockReturnValue({
      viewState: 'ready',
      data: {
        headerData: {
          title: 'Maria',
          subtitle: 'maria@sistema.com',
          avatarFallback: 'MA',
          statusLabel: 'Ativo',
          statusColor: 'success',
        },
        tabs: [
          {
            id: 'summary',
            label: 'Resumo',
            sections: [
              {
                id: 'main',
                title: 'Dados principais',
                items: [{ label: 'Tenant', value: 'Escola Aurora' }],
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

    render(<ClientProfilePage />);

    expect(screen.getByText('Maria')).toBeInTheDocument();
    expect(screen.getByText('Escola Aurora')).toBeInTheDocument();
    expect(screen.getByText('Alterar senha')).toBeInTheDocument();
  });
});
