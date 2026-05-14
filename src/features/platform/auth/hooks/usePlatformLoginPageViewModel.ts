import { usePlatformLoginFlow } from '@features/platform/auth/hooks/usePlatformLoginFlow';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';
import { isAuthenticatedForDomain } from '@shared/types/auth/guards';

export const usePlatformLoginPageViewModel = () => {
  const { form, loading, handleSubmit } = usePlatformLoginFlow();
  const { authDomain, flowStep, session } = useAuth();
  const isAuthenticated = isAuthenticatedForDomain(
    authDomain,
    flowStep,
    session,
    AUTH_DOMAIN.PLATFORM,
  );

  return { form, loading, handleSubmit, isAuthenticated };
};
