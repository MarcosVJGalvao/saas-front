import { useTheme } from '@mui/material/styles';
import { usePlatformLoginFlow } from './usePlatformLoginFlow';
import { useAuth } from '../useAuth/useAuth';
import { AUTH_DOMAIN } from '../../models/auth/auth';
import { isAuthenticatedForDomain } from '../../models/auth/guards';

export const usePlatformLoginPageViewModel = () => {
  const { form, loading, handleSubmit } = usePlatformLoginFlow();
  const { authDomain, flowStep, session } = useAuth();
  const theme = useTheme();
  const isAuthenticated = isAuthenticatedForDomain(
    authDomain,
    flowStep,
    session,
    AUTH_DOMAIN.PLATFORM,
  );

  return { form, loading, handleSubmit, theme, isAuthenticated };
};
