import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useForgotPasswordState } from '@features/client/auth/hooks/useForgotPasswordState';
import { clientAuthService } from '@features/client/auth/services/service';

vi.mock('@features/client/auth/services/service', () => ({
  clientAuthService: {
    forgotPassword: vi.fn(),
  },
}));

describe('useForgotPasswordState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marca envio após sucesso', async () => {
    vi.mocked(clientAuthService.forgotPassword).mockResolvedValue({ status: 'sent_if_exists' });
    const { result } = renderHook(() => useForgotPasswordState());

    await act(async () => {
      await result.current.submitForgotPassword('user@test.com');
    });

    expect(clientAuthService.forgotPassword).toHaveBeenCalledWith('user@test.com');
    expect(result.current.sent).toBe(true);
  });
});
