import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useClientHomeData,
  CLIENT_HOME_MESSAGES,
} from '@features/client/home/hooks/useClientHomeData';
import { clientAuthService } from '@features/client/auth/services/service';

vi.mock('@features/client/auth/services/service', () => ({
  clientAuthService: {
    me: vi.fn(),
  },
}));

describe('useClientHomeData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega perfil com sucesso', async () => {
    vi.mocked(clientAuthService.me).mockResolvedValue({
      id: '1',
      email: 'user@test.com',
      tenantId: 'tenant-1',
      name: 'User Test',
      status: 'ACTIVE',
      permissions: ['users:read'],
      client: { role: 'Administrador' },
      tenant: { id: 'tenant-1', name: 'School System' },
    });

    const { result } = renderHook(() => useClientHomeData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.errorMessage).toBe('');
    expect(result.current.profile?.email).toBe('user@test.com');
  });

  it('retorna mensagem em português ao falhar', async () => {
    vi.mocked(clientAuthService.me).mockRejectedValue(new Error('failure'));

    const { result } = renderHook(() => useClientHomeData());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
    expect(result.current.errorMessage).toBe(CLIENT_HOME_MESSAGES.loadError);
  });
});
