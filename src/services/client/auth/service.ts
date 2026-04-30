import { clientAuthEndpoints } from './endpoints';
import type { ClientLoginResponse } from './types';

export const clientAuthService = {
  async login(email: string, password: string): Promise<ClientLoginResponse> {
    const { data } = await clientAuthEndpoints.login({ email, password });
    return data;
  },
};
