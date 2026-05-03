import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { AppForm } from '@/components/common/form/AppForm';
import { useForm } from '@/forms/useForm';
import { loginSchema } from '@/forms/validators';
import { useForgotPasswordState } from '@/hooks/client-auth/useForgotPasswordState';
import { PlatformAuthPageLayout } from '@/pages/platform/auth/PlatformAuthPageLayout';

const MESSAGES = {
  title: 'Esqueci minha senha',
  emailLabel: 'E-mail',
  submit: 'Enviar',
  sent: 'Se o e-mail existir, enviaremos as instruções para redefinição de senha.',
} as const;

const ForgotPasswordPage = () => {
  const { sent, submitForgotPassword } = useForgotPasswordState();
  const form = useForm(loginSchema.pick({ email: true }), { email: '' });

  const handleSubmit = async (data: { email: string }) => {
    await submitForgotPassword(data.email);
  };

  return (
    <PlatformAuthPageLayout>
      <AppForm form={form} onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {MESSAGES.title}
        </Typography>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={MESSAGES.emailLabel}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained">
          {MESSAGES.submit}
        </Button>
        {sent ? <Typography>{MESSAGES.sent}</Typography> : null}
      </AppForm>
    </PlatformAuthPageLayout>
  );
};

export default ForgotPasswordPage;
