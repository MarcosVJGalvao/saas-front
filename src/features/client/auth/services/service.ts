import { clientAuthEndpoints } from '@features/client/auth/services/endpoints';
import type {
  AuthSession,
  ClientChangePasswordRequest,
  ClientForgotPasswordResponse,
  ClientLoginResponse,
  ClientMeResponse,
  ClientResetPasswordRequest,
} from '@features/client/auth/services/types';

export const clientAuthService = {
  async login(email: string, password: string): Promise<ClientLoginResponse> {
    const { data } = await clientAuthEndpoints.login({ email, password });
    return data;
  },
  async refresh(refreshToken: string): Promise<AuthSession> {
    const { data } = await clientAuthEndpoints.refresh({ refreshToken });
    return data;
  },
  async logout(sessionId: string): Promise<void> {
    await clientAuthEndpoints.logout({ sessionId });
  },
  async me(): Promise<ClientMeResponse> {
    const { data } = await clientAuthEndpoints.me();
    return data;
  },
  async changePassword(payload: ClientChangePasswordRequest): Promise<void> {
    await clientAuthEndpoints.changePassword(payload);
  },
  async forgotPassword(email: string): Promise<ClientForgotPasswordResponse> {
    const { data } = await clientAuthEndpoints.forgotPassword({ email });
    return data;
  },
  async resetPassword(payload: ClientResetPasswordRequest): Promise<void> {
    await clientAuthEndpoints.resetPassword(payload);
  },
};
