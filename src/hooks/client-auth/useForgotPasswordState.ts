import { useState } from 'react';
import { clientAuthService } from '@/services/client/auth/service';

export const useForgotPasswordState = () => {
  const [sent, setSent] = useState(false);

  const submitForgotPassword = async (email: string) => {
    await clientAuthService.forgotPassword(email);
    setSent(true);
  };

  return { sent, submitForgotPassword };
};
