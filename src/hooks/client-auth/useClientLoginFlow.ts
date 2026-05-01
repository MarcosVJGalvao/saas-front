import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { useForm } from '../../forms/useForm';
import { loginSchema, type LoginSchema } from '../../forms/validators';
import { useAuth } from '../useAuth/useAuth';
import { useError } from '../useError/useError';
import { AUTH_DOMAIN } from '../../models/auth/auth';
import { clientAuthService } from '../../services/client/auth/service';
import { readLoginPreferences, writeLoginPreferences } from '../../services/auth/loginPreferences';

export const useClientLoginFlow = () => {
  const navigate = useNavigate();
  const { pushError } = useError();
  const { completeAuthentication } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm(loginSchema, { email: '', password: '', rememberMe: false });

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
