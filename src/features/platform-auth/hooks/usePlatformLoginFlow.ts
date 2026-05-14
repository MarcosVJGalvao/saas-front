import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { useAppForm } from '@shared/hooks/useAppForm';
import { loginSchema, type LoginSchema } from '@shared/schemas/authSchemas';
import { useAuth } from '@hooks/useAuth/useAuth';
import { useError } from '@hooks/useError/useError';
import { AUTH_DOMAIN } from '@models/auth/auth';
import { platformAuthService } from '@features/platform-auth/services/service';
import { readLoginPreferences, writeLoginPreferences } from '@services/auth/loginPreferences';

export const usePlatformLoginFlow = () => {
  const navigate = useNavigate();
  const { pushError } = useError();
  const { startMfaChallenge, setTotpSetup } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useAppForm(loginSchema, { email: '', password: '', rememberMe: false });

  useEffect(() => {
    const preferences = readLoginPreferences(AUTH_DOMAIN.PLATFORM);
    form.reset({
      email: preferences.email,
      password: '',
      rememberMe: preferences.rememberMe,
    });
  }, [form]);

  const completeLoginFlow = async (data: LoginSchema) => {
    const loginResponse = await platformAuthService.login(data.email, data.password);
    const requiresSetup = Boolean(loginResponse.mfaNotConfigured);
    startMfaChallenge(
      AUTH_DOMAIN.PLATFORM,
      loginResponse.challengeToken,
      requiresSetup,
      data.rememberMe,
    );
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
      writeLoginPreferences(AUTH_DOMAIN.PLATFORM, {
        email: data.email,
        rememberMe: data.rememberMe,
      });
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
