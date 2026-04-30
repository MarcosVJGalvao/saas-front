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
  sessionId: string;
}

export interface PlatformVerifySetupResponse {
  verified: boolean;
}
