export interface ClientLoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  sessionId: string;
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
  status: 'ACTIVE' | 'INACTIVE';
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
