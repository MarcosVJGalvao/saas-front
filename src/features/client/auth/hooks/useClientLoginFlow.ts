import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { useAppForm } from '@shared/hooks/useAppForm';
import { loginSchema, type LoginSchema } from '@shared/schemas/authSchemas';
import { useAuth } from '@shared/hooks/useAuth/useAuth';
import { useError } from '@shared/hooks/useError/useError';
import { AUTH_DOMAIN } from '@shared/types/auth/auth';
import { clientAuthService } from '@features/client/auth/services/service';
import {
  readLoginPreferences,
  writeLoginPreferences,
} from '@shared/services/auth/loginPreferences';

export const useClientLoginFlow = () => {
  const navigate = useNavigate();
  const { pushError } = useError();
  const { completeAuthentication } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useAppForm(loginSchema, { email: '', password: '', rememberMe: false });

  useEffect(() => {
    const preferences = readLoginPreferences(AUTH_DOMAIN.CLIENT);
    form.reset({
      email: preferences.email,
      password: '',
      rememberMe: preferences.rememberMe,
    });
  }, [form]);

  const handleSubmit = async (data: LoginSchema) => {
    setLoading(true);
    try {
      writeLoginPreferences(AUTH_DOMAIN.CLIENT, {
        email: data.email,
        rememberMe: data.rememberMe,
      });
      const session = await clientAuthService.login(data.email, data.password);
      completeAuthentication(AUTH_DOMAIN.CLIENT, session, data.rememberMe);
      void navigate('/client/home', { replace: true });
    } catch (error) {
      pushError(ErrorHandler.normalize(error));
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleSubmit };
};
