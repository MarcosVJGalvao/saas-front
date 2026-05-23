import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlatformHomePage from '@features/platform/home/pages/HomePage';
import { usePlatformHomePage } from '@features/platform/home/hooks/usePlatformHomePage';

vi.mock('@features/platform/home/hooks/usePlatformHomePage', () => ({
  usePlatformHomePage: vi.fn(),
}));

describe('PlatformHomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza estado vazio', () => {
    vi.mocked(usePlatformHomePage).mockReturnValue({
      loading: false,
      errorMessage: '',
      profile: null,
      onRetry: vi.fn(),
      messages: { title: 'Central da plataforma', subtitle: 'Sub', empty: 'Sem perfil.' },
      metricItems: [],
      quickLinks: [],
      recommendedActions: [],
    });

    render(
      <MemoryRouter>
        <PlatformHomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Sem perfil.')).toBeInTheDocument();
  });

  it('renderiza a home curada da plataforma', () => {
    vi.mocked(usePlatformHomePage).mockReturnValue({
      loading: false,
      errorMessage: '',
      profile: {
        id: '1',
        email: 'admin@sistema.com',
        name: 'Admin',
        status: 'Ativo',
        roles: ['Administrador'],
        permissions: ['platform:*'],
      },
      onRetry: vi.fn(),
      messages: {
        title: 'Central da plataforma',
        subtitle: 'Subtítulo da plataforma',
        empty: 'Vazio',
      },
      metricItems: [
        {
          id: 'permissions',
          label: 'Permissões',
          value: '1',
          helper: 'Conjunto de acessos disponíveis.',
          icon: null,
        },
      ],
      quickLinks: [
        {
          id: 'clients',
          label: 'Clientes',
          description: 'Acompanhe tenants.',
          to: '/platform/clients',
          icon: null,
        },
      ],
      recommendedActions: [
        {
          id: 'review-security',
          title: 'Conferir acessos administrativos',
          description: 'Revise permissões.',
        },
      ],
    });

    render(
      <MemoryRouter>
        <PlatformHomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Central da plataforma')).toBeInTheDocument();
    expect(screen.getByText('Boas-vindas, Admin.')).toBeInTheDocument();
    expect(screen.getByText('Permissões')).toBeInTheDocument();
    expect(screen.getByText('Clientes')).toBeInTheDocument();
    expect(screen.getByText('Conferir acessos administrativos')).toBeInTheDocument();
  });
});
