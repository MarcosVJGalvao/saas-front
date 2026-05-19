import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CLIENT_PROFILE_MESSAGES,
  useClientProfile,
} from '@features/client/auth/hooks/useClientProfile';
import { clientAuthService } from '@features/client/auth/services/service';

vi.mock('@features/client/auth/services/service', () => ({
  clientAuthService: {
    me: vi.fn(),
  },
}));

describe('useClientProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega perfil com sucesso e normaliza status', async () => {
    vi.mocked(clientAuthService.me).mockResolvedValue({
      id: '1',
      tenantId: 'tenant-1',
      email: 'marcos@test.com',
      name: 'Marcos',
      status: 'active',
      permissions: ['*:*'],
      client: { role: 'Administrador' },
      tenant: { id: 'tenant-1', name: 'School System' },
    });

    const { result } = renderHook(() => useClientProfile({ enabled: true }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.errorMessage).toBe('');
    expect(result.current.profile?.status).toBe('Ativo');
    expect(result.current.profile?.permissions).toEqual(['*:*']);
    expect(result.current.profile?.client.role).toBe('Administrador');
  });

  it('retorna erro amigavel quando falhar', async () => {
    vi.mocked(clientAuthService.me).mockRejectedValue(new Error('failure'));

    const { result } = renderHook(() => useClientProfile({ enabled: true }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
    expect(result.current.errorMessage).toBe(CLIENT_PROFILE_MESSAGES.loadError);
  });
});
