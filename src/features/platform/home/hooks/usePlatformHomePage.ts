import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { usePlatformProfile } from '@features/platform/auth/hooks/usePlatformProfile';

export const PLATFORM_HOME_PAGE_MESSAGES = {
  title: 'Home da plataforma',
  subtitle: 'Acompanhe o contexto administrativo e os dados do acesso atual.',
  empty: 'Nenhum dado de perfil foi encontrado para este acesso.',
};

export const usePlatformHomePage = () => {
  const { authDomain, session } = useAuth();
  const { loading, profile, errorMessage, refetch } = usePlatformProfile({
    enabled: authDomain === 'platform' && session !== null,
  });

  return {
    loading,
    profile,
    errorMessage,
    onRetry: refetch,
    messages: PLATFORM_HOME_PAGE_MESSAGES,
  };
};
