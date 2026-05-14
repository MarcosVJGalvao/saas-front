import { describe, expect, it, vi } from 'vitest';
import { clientAuthService } from '@features/client-auth/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('clientAuthService', () => {
  it('calls login endpoint with credentials', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { accessToken: 'a', refreshToken: 'r', sessionId: 's', expiresIn: '15m' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} },
    });

    const response = await clientAuthService.login('user@empresa.com', 'senha123');

    expect(postSpy).toHaveBeenCalledWith('/api/auth/login', {
      email: 'user@empresa.com',
      password: 'senha123',
    });
    expect(response.expiresIn).toBe('15m');
  });
});
