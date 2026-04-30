export interface ClientLoginRequest {
  email: string;
  password: string;
}

export interface ClientLoginResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}
