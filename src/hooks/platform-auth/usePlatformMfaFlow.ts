import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { useForm } from '../../forms/useForm';
import { totpCodeSchema, type TotpCodeSchema } from '../../forms/validators';
import { useAuth } from '../useAuth/useAuth';
import { useError } from '../useError/useError';
import { AUTH_DOMAIN } from '../../models/auth/auth';
import { platformAuthService } from '../../services/platform/auth/service';

export const usePlatformMfaFlow = () => {
  const navigate = useNavigate();
  const { pushError } = useError();
  const { challengeToken, completeAuthentication } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm(totpCodeSchema, { totpCode: '' });

  const handleSubmit = async (data: TotpCodeSchema) => {
    if (challengeToken === null) {
      return;
    }
    setLoading(true);
    try {
      const session = await platformAuthService.verifyTotp(challengeToken, data.totpCode);
      completeAuthentication(AUTH_DOMAIN.PLATFORM, session);
      void navigate('/platform/home', { replace: true });
    } catch (error) {
      pushError(ErrorHandler.normalize(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    challengeToken,
    form,
    loading,
    handleSubmit,
  };
};
