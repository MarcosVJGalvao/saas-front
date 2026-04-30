import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { useForm } from '../../forms/useForm';
import { loginSchema, type LoginSchema } from '../../forms/validators';
import { useAuth } from '../useAuth/useAuth';
import { useError } from '../useError/useError';
import { AUTH_DOMAIN } from '../../models/auth/auth';
import { platformAuthService } from '../../services/platform/auth/service';

export const usePlatformLoginFlow = () => {
  const navigate = useNavigate();
  const { pushError } = useError();
  const { startMfaChallenge, setTotpSetup } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm(loginSchema, { email: '', password: '' });

  const completeLoginFlow = async (data: LoginSchema) => {
    const loginResponse = await platformAuthService.login(data.email, data.password);
    const requiresSetup = Boolean(loginResponse.mfaNotConfigured);
    startMfaChallenge(AUTH_DOMAIN.PLATFORM, loginResponse.challengeToken, requiresSetup);
    if (requiresSetup) {
      const setupResponse = await platformAuthService.setupFromChallenge(
        loginResponse.challengeToken,
      );
      setTotpSetup(setupResponse);
      void navigate('/platform/mfa-setup', { replace: true });
      return;
    }
    void navigate('/platform/mfa', { replace: true });
  };

  const handleSubmit = async (data: LoginSchema) => {
    setLoading(true);
    try {
      await completeLoginFlow(data);
    } catch (error) {
      pushError(ErrorHandler.normalize(error));
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleSubmit,
  };
};
