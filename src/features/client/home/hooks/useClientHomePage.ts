import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useClientProfile } from '@features/client/auth/hooks/useClientProfile';

export const CLIENT_HOME_PAGE_MESSAGES = {
  title: 'Home do cliente',
  subtitle: 'Consulte seus dados de acesso e o contexto atual do tenant.',
  empty: 'Nenhum dado de perfil foi encontrado para este acesso.',
};

export const useClientHomePage = () => {
  const { authDomain, session } = useAuth();
  const { loading, profile, errorMessage, refetch } = useClientProfile({
    enabled: authDomain === 'client' && session !== null,
  });

  return {
    loading,
    profile,
    errorMessage,
    onRetry: refetch,
    messages: CLIENT_HOME_PAGE_MESSAGES,
  };
};
