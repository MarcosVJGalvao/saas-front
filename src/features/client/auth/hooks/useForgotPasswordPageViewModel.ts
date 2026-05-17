import { useAppForm } from '@shared/hooks/useAppForm';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@features/client/auth/schemas/clientAuthFormSchemas';
import { useForgotPasswordState } from '@features/client/auth/hooks/useForgotPasswordState';

const MESSAGES = {
  title: 'Esqueci minha senha',
  emailLabel: 'E-mail',
  submit: 'Enviar',
  sent: 'Se o e-mail existir, enviaremos instruções para redefinição de senha.',
};

export const useForgotPasswordPageViewModel = () => {
  const { sent, submitForgotPassword } = useForgotPasswordState();
  const form = useAppForm(forgotPasswordSchema, { email: '' });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    await submitForgotPassword(data.email);
  };

  return { messages: MESSAGES, sent, form, handleSubmit };
};
