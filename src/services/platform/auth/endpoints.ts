import { httpClient } from '../../httpClient';
import type {
  PlatformLoginResponse,
  PlatformTotpSetupResponse,
  PlatformVerifySetupResponse,
  PlatformVerifyTotpResponse,
} from './types';

const PLATFORM_AUTH_BASE_PATH = '/api/platform/auth';

export const platformAuthEndpoints = {
  login: (email: string, password: string) =>
    httpClient.post<PlatformLoginResponse>(`${PLATFORM_AUTH_BASE_PATH}/login`, { email, password }),

  setupFromChallenge: (challengeToken: string) =>
    httpClient.post<PlatformTotpSetupResponse>(
      `${PLATFORM_AUTH_BASE_PATH}/totp/setup-from-challenge`,
      { challengeToken },
    ),

  verifyTotp: (challengeToken: string, totpCode: string) =>
    httpClient.post<PlatformVerifyTotpResponse>(`${PLATFORM_AUTH_BASE_PATH}/verify-totp`, {
      challengeToken,
      totpCode,
    }),

  refresh: (refreshToken: string) =>
    httpClient.post<PlatformVerifyTotpResponse>(`${PLATFORM_AUTH_BASE_PATH}/refresh`, {
      refreshToken,
    }),

  verifySetup: (totpCode: string, accessToken: string) =>
    httpClient.post<PlatformVerifySetupResponse>(
      `${PLATFORM_AUTH_BASE_PATH}/totp/verify-setup`,
      { totpCode },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    ),

  resetTotp: (currentPassword: string, accessToken: string) =>
    httpClient.post(
      `${PLATFORM_AUTH_BASE_PATH}/totp/reset`,
      { currentPassword },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    ),

  resetTotpByLogin: (email: string, currentPassword: string) =>
    httpClient.post(`${PLATFORM_AUTH_BASE_PATH}/totp/reset-by-login`, { email, currentPassword }),
};
