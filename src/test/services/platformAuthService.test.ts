import { describe, expect, it, vi } from 'vitest';
import { platformAuthService } from '@features/platform/auth/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('platformAuthService', () => {
  it('calls login endpoint with credentials', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { challengeToken: 'token-1' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: {} },
    });

    const response = await platformAuthService.login('admin@empresa.com', 'senha123');

    expect(postSpy).toHaveBeenCalledWith('/api/platform/auth/login', {
      email: 'admin@empresa.com',
      password: 'senha123',
    });
    expect(response.challengeToken).toBe('token-1');
  });
});
