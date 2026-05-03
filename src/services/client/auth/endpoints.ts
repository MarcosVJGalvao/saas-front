import { httpClient } from '../../httpClient';
import type {
  ClientChangePasswordRequest,
  ClientForgotPasswordRequest,
  ClientForgotPasswordResponse,
  ClientLoginRequest,
  ClientLoginResponse,
  ClientLogoutRequest,
  ClientMeResponse,
  ClientRefreshRequest,
  ClientRefreshResponse,
  ClientResetPasswordRequest,
} from './types';

const CLIENT_AUTH_BASE_PATH = '/api/auth';

export const clientAuthEndpoints = {
  login: (payload: ClientLoginRequest) =>
    httpClient.post<ClientLoginResponse>(`${CLIENT_AUTH_BASE_PATH}/login`, payload),
  refresh: (payload: ClientRefreshRequest) =>
    httpClient.post<ClientRefreshResponse>(`${CLIENT_AUTH_BASE_PATH}/refresh`, payload),
  logout: (payload: ClientLogoutRequest) =>
    httpClient.post(`${CLIENT_AUTH_BASE_PATH}/logout`, payload),
  me: () => httpClient.get<ClientMeResponse>(`${CLIENT_AUTH_BASE_PATH}/me`),
  changePassword: (payload: ClientChangePasswordRequest) =>
    httpClient.post(`${CLIENT_AUTH_BASE_PATH}/change-password`, payload),
  forgotPassword: (payload: ClientForgotPasswordRequest) =>
    httpClient.post<ClientForgotPasswordResponse>(
      `${CLIENT_AUTH_BASE_PATH}/forgot-password`,
      payload,
    ),
  resetPassword: (payload: ClientResetPasswordRequest) =>
    httpClient.post(`${CLIENT_AUTH_BASE_PATH}/reset-password`, payload),
};
