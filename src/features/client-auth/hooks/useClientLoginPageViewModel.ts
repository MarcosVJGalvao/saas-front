import { useClientLoginFlow } from '@features/client-auth/hooks/useClientLoginFlow';
import { useAuth } from '@hooks/useAuth/useAuth';
import { AUTH_DOMAIN } from '@models/auth/auth';
import { isAuthenticatedForDomain } from '@models/auth/guards';

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
