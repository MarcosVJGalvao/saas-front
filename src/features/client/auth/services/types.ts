import type { AuthSession } from '@shared/types/authSession';

export type { AuthSession } from '@shared/types/authSession';

export interface ClientLoginRequest {
  email: string;
  password: string;
}

export type ClientLoginResponse = AuthSession;
export type ClientRefreshResponse = AuthSession;

export interface ClientRefreshRequest {
  refreshToken: string;
}

export interface ClientLogoutRequest {
  sessionId: string;
}

export interface ClientMeResponse {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  status: string;
  permissions: string[];
  client: {
    role: string;
  };
  tenant: {
    id: string;
    name: string;
  };
}

export interface ClientChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ClientForgotPasswordRequest {
  email: string;
}

export interface ClientForgotPasswordResponse {
  status: 'sent_if_exists';
  token?: string;
}

export interface ClientResetPasswordRequest {
  token: string;
  newPassword: string;
}
