import { useClientLoginFlow } from '@features/client/auth/hooks/useClientLoginFlow';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';
import { isAuthenticatedForDomain } from '@shared/types/auth/guards';

export const useClientLoginPageViewModel = () => {
  const { form, loading, handleSubmit } = useClientLoginFlow();
  const { authDomain, flowStep, session } = useAuth();
  const isAuthenticated = isAuthenticatedForDomain(
    authDomain,
    flowStep,
    session,
    AUTH_DOMAIN.CLIENT,
  );

  return { form, loading, handleSubmit, isAuthenticated };
};
