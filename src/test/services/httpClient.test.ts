import { describe, expect, it } from 'vitest';
import { shouldSkipTokenRefreshForRequest } from '@shared/services/httpClient';

describe('shouldSkipTokenRefreshForRequest', () => {
  it('ignora rotas públicas de autenticação do cliente', () => {
    expect(shouldSkipTokenRefreshForRequest('/api/auth/login')).toBe(true);
    expect(shouldSkipTokenRefreshForRequest('/api/auth/forgot-password')).toBe(true);
    expect(shouldSkipTokenRefreshForRequest('/api/auth/reset-password')).toBe(true);
  });

  it('ignora rotas públicas de autenticação da plataforma', () => {
    expect(shouldSkipTokenRefreshForRequest('/api/platform/auth/login')).toBe(true);
    expect(shouldSkipTokenRefreshForRequest('/api/platform/auth/verify-totp')).toBe(true);
  });

  it('mantém refresh automático para rotas protegidas', () => {
    expect(shouldSkipTokenRefreshForRequest('/api/client/people')).toBe(false);
  });
});
