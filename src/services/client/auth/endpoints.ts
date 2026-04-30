import { httpClient } from '../../httpClient';
import type { ClientLoginRequest, ClientLoginResponse } from './types';

const CLIENT_AUTH_BASE_PATH = '/client/auth';

export const clientAuthEndpoints = {
  login: (payload: ClientLoginRequest) =>
    httpClient.post<ClientLoginResponse>(`${CLIENT_AUTH_BASE_PATH}/login`, payload),
};
