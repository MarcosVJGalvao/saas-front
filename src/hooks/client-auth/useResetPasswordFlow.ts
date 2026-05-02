import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { clientAuthService } from '@/services/client/auth/service';

export const useResetPasswordFlow = (token: string) => {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();

  const submitResetPassword = async (newPassword: string) => {
    await clientAuthService.resetPassword({ token, newPassword });
    clearAuth();
    void navigate('/client/login', { replace: true });
  };

  return { submitResetPassword };
};
