import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { platformAuthService } from '@features/platform/auth/services/service';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@features/client/auth/schemas/clientAuthFormSchemas';
import { useAppForm } from '@shared/hooks/useAppForm';

export const usePlatformChangePasswordPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useAppForm(changePasswordSchema, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await platformAuthService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setSuccessMessage('Senha alterada com sucesso.');
      form.reset();
    } catch {
      setErrorMessage(
        'Não foi possível alterar a senha. Verifique a senha atual e tente novamente.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    onBack: () => void navigate('/platform/me'),
    submitting,
    errorMessage,
    successMessage,
  };
};
