import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { usePlatformProfile } from '@features/platform/auth/hooks/usePlatformProfile';
import {
  buildPlatformHomeMetrics,
  getPlatformQuickLinks,
  platformRecommendedActions,
} from '@features/platform/home/normalizers/platformHome.normalizer';

export const PLATFORM_HOME_PAGE_MESSAGES = {
  title: 'Central da plataforma',
  subtitle: 'Entre com contexto, prioridades e atalhos para a operação administrativa.',
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
    metricItems: profile ? buildPlatformHomeMetrics(profile) : [],
    quickLinks: getPlatformQuickLinks(),
    recommendedActions: platformRecommendedActions,
  };
};
