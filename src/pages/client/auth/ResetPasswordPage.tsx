import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { AppForm } from '@/components/common/form/AppForm';
import { useForm } from '@/forms/useForm';
import { useResetPasswordFlow } from '@/hooks/client-auth/useResetPasswordFlow';
import { PlatformAuthPageLayout } from '@/pages/platform/auth/PlatformAuthPageLayout';

const resetSchema = z.object({
  newPassword: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
});

const MESSAGES = {
  title: 'Redefinir senha',
  fieldLabel: 'Nova senha',
  submit: 'Redefinir',
} as const;

const readTokenFromSearchParams = (searchParams: URLSearchParams): string =>
  searchParams.get('token') ?? '';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = readTokenFromSearchParams(searchParams);
  const form = useForm(resetSchema, { newPassword: '' });
  const { submitResetPassword } = useResetPasswordFlow(token);

  const handleSubmit = async (data: { newPassword: string }) => {
    await submitResetPassword(data.newPassword);
  };

  return (
    <PlatformAuthPageLayout>
      <AppForm form={form} onSubmit={handleSubmit}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {MESSAGES.title}
        </Typography>
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="password"
              label={MESSAGES.fieldLabel}
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={token.length === 0}>
          {MESSAGES.submit}
        </Button>
      </AppForm>
    </PlatformAuthPageLayout>
  );
};

export default ResetPasswordPage;
