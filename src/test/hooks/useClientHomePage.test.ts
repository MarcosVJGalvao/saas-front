import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useClientHomePage,
  CLIENT_HOME_PAGE_MESSAGES,
} from '@features/client/home/hooks/useClientHomePage';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useClientProfile } from '@features/client/auth/hooks/useClientProfile';

vi.mock('@shared/hooks/useAuth/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@features/client/auth/hooks/useClientProfile', () => ({
  useClientProfile: vi.fn(),
}));

describe('useClientHomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usa perfil do cliente quando a sessão está ativa', () => {
    vi.mocked(useAuth).mockReturnValue({
      authDomain: 'client',
      flowStep: 'idle',
      challengeToken: null,
      totpSetup: null,
      session: {
        accessToken: 'token',
        refreshToken: 'refresh',
        expiresIn: '3600',
        sessionId: 'session-1',
      },
      startMfaChallenge: vi.fn(),
      setTotpSetup: vi.fn(),
      completeAuthentication: vi.fn(),
      updateClientSessionFromRefresh: vi.fn(),
      clearAuth: vi.fn(),
    });

    const refetch = vi.fn();

    vi.mocked(useClientProfile).mockReturnValue({
      loading: false,
      errorMessage: '',
      profile: {
        id: '1',
        email: 'user@test.com',
        tenantId: 'tenant-1',
        name: 'User Test',
        status: 'Ativo',
        permissions: [],
        client: { role: 'Administrador' },
        tenant: { id: 'tenant-1', name: 'School System' },
      },
      refetch,
    });

    const { result } = renderHook(() => useClientHomePage());

    expect(result.current.profile?.email).toBe('user@test.com');
    expect(result.current.errorMessage).toBe('');
    expect(result.current.messages).toEqual(CLIENT_HOME_PAGE_MESSAGES);
    expect(result.current.onRetry).toBe(refetch);
  });
});
