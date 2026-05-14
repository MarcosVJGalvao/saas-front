import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { DomainProtectedRoute } from '@app/guards/DomainProtectedRoute';
import { AuthProvider } from '@shared/hooks/useAuth/useAuth';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';

describe('DomainProtectedRoute', () => {
  it('redirects to login when no valid domain session exists', () => {
    const { queryByText } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/platform']}>
          <DomainProtectedRoute domain={AUTH_DOMAIN.PLATFORM} loginPath="/platform/login">
            <span>Conteudo protegido</span>
          </DomainProtectedRoute>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(queryByText('Conteudo protegido')).not.toBeInTheDocument();
  });
});
