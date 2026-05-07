import { useCallback } from 'react';
import { clientAuthService } from '../../services/client/auth/service';

export const useClientLogout = () => {
  const logout = useCallback(async (sessionId: string): Promise<void> => {
    await clientAuthService.logout(sessionId);
  }, []);

  return { logout };
};
