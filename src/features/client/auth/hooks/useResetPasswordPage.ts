import { useSearchParams } from 'react-router-dom';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from '@features/client/auth/schemas/clientAuthFormSchemas';
import { useResetPasswordFlow } from '@features/client/auth/hooks/useResetPasswordFlow';

const MESSAGES = {
  title: 'Redefinir senha',
  fieldLabel: 'Nova senha',
  submit: 'Redefinir',
};

const readTokenFromSearchParams = (searchParams: URLSearchParams): string =>
  searchParams.get('token') ?? '';

export const useResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = readTokenFromSearchParams(searchParams);
  const form = useAppForm(resetPasswordSchema, { newPassword: '' });
  const { submitResetPassword } = useResetPasswordFlow(token);

  const handleSubmit = async (data: ResetPasswordFormData) => {
    await submitResetPassword(data.newPassword);
  };

  return {
    messages: MESSAGES,
    form,
    handleSubmit,
    submitDisabled: token.length === 0,
  };
};
