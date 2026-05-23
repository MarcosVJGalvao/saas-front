import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClientHomePage from '@features/client/home/pages/HomePage';
import { useClientHomePage } from '@features/client/home/hooks/useClientHomePage';

vi.mock('@features/client/home/hooks/useClientHomePage', () => ({
  useClientHomePage: vi.fn(),
}));

describe('ClientHomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza loading', () => {
    vi.mocked(useClientHomePage).mockReturnValue({
      loading: true,
      errorMessage: '',
      profile: null,
      onRetry: vi.fn(),
      messages: { title: 'Central do cliente', subtitle: 'Sub', empty: 'Vazio' },
      metricItems: [],
      quickLinks: [],
      recommendedActions: [],
    });

    render(
      <MemoryRouter>
        <ClientHomePage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText('Carregando home do cliente')).toBeInTheDocument();
  });

  it('renderiza erro com retry', () => {
    const onRetry = vi.fn();

    vi.mocked(useClientHomePage).mockReturnValue({
      loading: false,
      errorMessage: 'Falha ao carregar.',
      profile: null,
      onRetry,
      messages: { title: 'Central do cliente', subtitle: 'Sub', empty: 'Vazio' },
      metricItems: [],
      quickLinks: [],
      recommendedActions: [],
    });

    render(
      <MemoryRouter>
        <ClientHomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Falha ao carregar.')).toBeInTheDocument();
    expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
  });

  it('renderiza a home curada quando houver perfil', () => {
    vi.mocked(useClientHomePage).mockReturnValue({
      loading: false,
      errorMessage: '',
      profile: {
        id: '1',
        email: 'user@test.com',
        tenantId: 'tenant-1',
        name: 'Maria',
        status: 'Ativo',
        permissions: ['student:read'],
        client: { role: 'Secretaria' },
        tenant: { id: 'tenant-1', name: 'Escola Aurora' },
      },
      onRetry: vi.fn(),
      messages: {
        title: 'Central do cliente',
        subtitle: 'Subtítulo da home',
        empty: 'Vazio',
      },
      metricItems: [
        {
          id: 'tenant',
          label: 'Tenant ativo',
          value: 'Escola Aurora',
          helper: 'Contexto operacional da sessão atual.',
          icon: null,
        },
      ],
      quickLinks: [
        {
          id: 'students',
          label: 'Alunos',
          description: 'Gerencie cadastros.',
          to: '/client/students',
          icon: null,
        },
      ],
      recommendedActions: [
        {
          id: 'review-profile',
          title: 'Revisar dados de acesso',
          description: 'Confira suas permissões.',
        },
      ],
    });

    render(
      <MemoryRouter>
        <ClientHomePage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Central do cliente')).toBeInTheDocument();
    expect(screen.getByText('Bom trabalho, Maria.')).toBeInTheDocument();
    expect(screen.getByText('Tenant ativo')).toBeInTheDocument();
    expect(screen.getByText('Alunos')).toBeInTheDocument();
    expect(screen.getByText('Revisar dados de acesso')).toBeInTheDocument();
  });
});
