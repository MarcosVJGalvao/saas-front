import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { CLIENT_HOME_MESSAGES } from '@features/client/home/hooks/useClientHomeData';
import { useClientProfile } from '@features/client/auth/hooks/useClientProfile';

export const useClientHomePageViewModel = () => {
  const { authDomain, session } = useAuth();
  const { loading, profile, errorMessage } = useClientProfile({
    enabled: authDomain === 'client' && session !== null,
  });

  return { messages: CLIENT_HOME_MESSAGES, loading, profile, errorMessage };
};
