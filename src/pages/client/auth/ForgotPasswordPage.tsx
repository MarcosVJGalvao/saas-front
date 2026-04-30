import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { AppForm } from '@/components/common/form/AppForm';
import { useForm } from '@/forms/useForm';
import { loginSchema } from '@/forms/validators';
import { clientAuthService } from '@/services/client/auth/service';
import { PlatformAuthPageLayout } from '@/pages/platform/auth/PlatformAuthPageLayout';

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);
  const form = useForm(loginSchema.pick({ email: true }), { email: '' });

  const handleSubmit = async (data: { email: string }) => {
    await clientAuthService.forgotPassword(data.email);
    setSent(true);
  };

  return (
    <PlatformAuthPageLayout>
      <AppForm form={form} onSubmit={handleSubmit}>
        <Typography variant="h4">Esqueci minha senha</Typography>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="E-mail"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained">
          Enviar
        </Button>
        {sent ? (
          <Typography>
            Se o e-mail existir, enviaremos as instrucoes para redefinicao de senha.
          </Typography>
        ) : null}
      </AppForm>
    </PlatformAuthPageLayout>
  );
};

export default ForgotPasswordPage;
