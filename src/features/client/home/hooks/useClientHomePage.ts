import { useSidebarNavigation } from '@shared/hooks/useSidebarNavigation';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useClientProfile } from '@features/client/auth/hooks/useClientProfile';
import {
  buildClientHomeMetrics,
  buildClientQuickLinks,
  clientRecommendedActions,
} from '@features/client/home/normalizers/clientHome.normalizer';

export const CLIENT_HOME_PAGE_MESSAGES = {
  title: 'Central do cliente',
  subtitle: 'Abra a operação com contexto do tenant, atalhos úteis e próximos passos recomendados.',
  empty: 'Nenhum dado de perfil foi encontrado para este acesso.',
};

export const useClientHomePage = () => {
  const { authDomain, session } = useAuth();
  const { loading, profile, errorMessage, refetch } = useClientProfile({
    enabled: authDomain === 'client' && session !== null,
  });
  const { navigationItems } = useSidebarNavigation(authDomain, {
    clientPermissions: profile?.permissions,
  });

  return {
    loading,
    profile,
    errorMessage,
    onRetry: refetch,
    messages: CLIENT_HOME_PAGE_MESSAGES,
    metricItems: profile ? buildClientHomeMetrics(profile) : [],
    quickLinks: buildClientQuickLinks(navigationItems),
    recommendedActions: clientRecommendedActions,
  };
};
