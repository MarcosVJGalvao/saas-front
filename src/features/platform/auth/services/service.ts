import { platformAuthEndpoints } from '@features/platform/auth/services/endpoints';
import type {
  PlatformLoginResponse,
  PlatformMeResponse,
  PlatformTotpSetupResponse,
  PlatformVerifySetupResponse,
  PlatformVerifyTotpResponse,
} from '@features/platform/auth/services/types';

export const platformAuthService = {
  async login(email: string, password: string): Promise<PlatformLoginResponse> {
    const { data } = await platformAuthEndpoints.login(email, password);
    return data;
  },

  async me(): Promise<PlatformMeResponse> {
    const { data } = await platformAuthEndpoints.me();
    return data;
  },

  async setupFromChallenge(challengeToken: string): Promise<PlatformTotpSetupResponse> {
    const { data } = await platformAuthEndpoints.setupFromChallenge(challengeToken);
    return data;
  },

  async verifyTotp(challengeToken: string, totpCode: string): Promise<PlatformVerifyTotpResponse> {
    const { data } = await platformAuthEndpoints.verifyTotp(challengeToken, totpCode);
    return data;
  },

  async refresh(refreshToken: string): Promise<PlatformVerifyTotpResponse> {
    const { data } = await platformAuthEndpoints.refresh(refreshToken);
    return data;
  },

  async verifySetup(totpCode: string, accessToken: string): Promise<PlatformVerifySetupResponse> {
    const { data } = await platformAuthEndpoints.verifySetup(totpCode, accessToken);
    return data;
  },

  async resetTotp(currentPassword: string, accessToken: string): Promise<void> {
    await platformAuthEndpoints.resetTotp(currentPassword, accessToken);
  },

  async resetTotpByLogin(email: string, currentPassword: string): Promise<void> {
    await platformAuthEndpoints.resetTotpByLogin(email, currentPassword);
  },
};
