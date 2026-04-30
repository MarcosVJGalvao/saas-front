import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { useForm } from '../../forms/useForm';
import { loginSchema, type LoginSchema } from '../../forms/validators';
import { useAuth } from '../useAuth/useAuth';
import { useError } from '../useError/useError';
import { AUTH_DOMAIN } from '../../models/auth/auth';
import { clientAuthService } from '../../services/client/auth/service';

export const useClientLoginFlow = () => {
  const navigate = useNavigate();
  const { pushError } = useError();
  const { completeAuthentication } = useAuth();
  const [loading, setLoading] = useState(false);
  const form = useForm(loginSchema, { email: '', password: '' });

  const handleSubmit = async (data: LoginSchema) => {
    setLoading(true);
    try {
      const session = await clientAuthService.login(data.email, data.password);
      completeAuthentication(AUTH_DOMAIN.CLIENT, session);
      void navigate('/client', { replace: true });
    } catch (error) {
      pushError(ErrorHandler.normalize(error));
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, handleSubmit };
};
