import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PermissionGate } from '../../components/common/access/PermissionGate';
import { ProtectedRoute } from '../../components/common/access/ProtectedRoute';

describe('Access components', () => {
  it('renders permission content when allowed', () => {
    const { getByText } = render(
      <PermissionGate allowed>
        <span>Permitido</span>
      </PermissionGate>,
    );
    expect(getByText('Permitido')).toBeInTheDocument();
  });

  it('renders protected children when authenticated', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProtectedRoute isAuthenticated>
          <span>Privado</span>
        </ProtectedRoute>
      </BrowserRouter>,
    );
    expect(getByText('Privado')).toBeInTheDocument();
  });
});
