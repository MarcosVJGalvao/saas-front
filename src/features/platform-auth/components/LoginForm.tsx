import { memo } from 'react';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppLoadingIndicator } from '@shared/components/data-display/AppLoadingIndicator';
import { AppText } from '@shared/components/data-display/AppText';
import { AppForm } from '@shared/components/form/AppForm';
import { FormTextField } from '@shared/components/form/FormTextField';
import { useAppForm } from '@shared/hooks/useAppForm';
import { loginSchema, type LoginSchema } from '@shared/schemas/authSchemas';

interface LoginFormProps {
  onSubmit: (data: LoginSchema) => Promise<void>;
  loading: boolean;
}

export const LoginForm = memo(({ onSubmit, loading }: LoginFormProps) => {
  const form = useAppForm(loginSchema, { email: '', password: '', rememberMe: false });

  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <AppText variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
        Acessar plataforma
      </AppText>
      <AppAlert severity="info">Validacao imediata com Zod + RHF.</AppAlert>
      <FormTextField<LoginSchema> name="email" label="Email" type="email" />
      <FormTextField<LoginSchema> name="password" label="Senha" type="password" />
      <AppButton
        type="submit"
        variant="contained"
        size="large"
        disabled={!form.formState.isValid || loading}
        aria-busy={loading}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        {loading ? <AppLoadingIndicator size={20} color="inherit" /> : 'Entrar'}
      </AppButton>
    </AppForm>
  );
});
