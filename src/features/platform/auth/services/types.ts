export interface PlatformLoginResponse {
  challengeToken: string;
  mfaNotConfigured?: boolean;
}

export interface PlatformTotpSetupResponse {
  secret: string;
  otpauthUrl: string;
  issuer: string;
}

export interface PlatformVerifyTotpResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  sessionId: string;
}

export interface PlatformVerifySetupResponse {
  verified: boolean;
}

export interface PlatformChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type PlatformUserStatus = 'ACTIVE' | 'INACTIVE';

export interface PlatformMeResponse {
  id: string;
  email: string;
  name: string;
  status: string;
  roles: string[];
  permissions: string[];
}
