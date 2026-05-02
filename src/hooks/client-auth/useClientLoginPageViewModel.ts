import { useTheme } from '@mui/material/styles';
import { useClientLoginFlow } from './useClientLoginFlow';
import { useAuth } from '../useAuth/useAuth';
import { AUTH_DOMAIN } from '../../models/auth/auth';
import { isAuthenticatedForDomain } from '../../models/auth/guards';

export const useClientLoginPageViewModel = () => {
  const { form, loading, handleSubmit } = useClientLoginFlow();
  const { authDomain, flowStep, session } = useAuth();
  const theme = useTheme();
  const isAuthenticated = isAuthenticatedForDomain(
    authDomain,
    flowStep,
    session,
    AUTH_DOMAIN.CLIENT,
  );

  return { form, loading, handleSubmit, theme, isAuthenticated };
};
