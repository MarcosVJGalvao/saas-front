import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PLATFORM_PROFILE_MESSAGES,
  usePlatformProfile,
} from '../../hooks/platform-auth/usePlatformProfile';
import { platformAuthService } from '../../services/platform/auth/service';

vi.mock('../../services/platform/auth/service', () => ({
  platformAuthService: {
    me: vi.fn(),
  },
}));

describe('usePlatformProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega perfil com sucesso e normaliza status', async () => {
    vi.mocked(platformAuthService.me).mockResolvedValue({
      id: '1',
      email: 'admin@sistema.com',
      name: 'Administrador da Plataforma',
      status: 'active',
      roles: ['Administrador'],
      permissions: ['platform:*'],
    });

    const { result } = renderHook(() => usePlatformProfile({ enabled: true }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.errorMessage).toBe('');
    expect(result.current.profile?.email).toBe('admin@sistema.com');
    expect(result.current.profile?.status).toBe('Ativo');
    expect(result.current.profile?.roles[0]).toBe('Administrador');
  });

  it('retorna erro amigavel quando falhar', async () => {
    vi.mocked(platformAuthService.me).mockRejectedValue(new Error('failure'));

    const { result } = renderHook(() => usePlatformProfile({ enabled: true }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toBeNull();
    expect(result.current.errorMessage).toBe(PLATFORM_PROFILE_MESSAGES.loadError);
  });

  it('nao chama endpoint quando estiver desabilitado', async () => {
    const { result } = renderHook(() => usePlatformProfile({ enabled: false }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(platformAuthService.me).not.toHaveBeenCalled();
    expect(result.current.profile).toBeNull();
  });
});
