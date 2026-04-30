import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Controller } from 'react-hook-form';
import { z } from 'zod';
import { AppForm } from '@/components/common/form/AppForm';
import { useForm } from '@/forms/useForm';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { PlatformAuthPageLayout } from '@/pages/platform/auth/PlatformAuthPageLayout';
import { clientAuthService } from '@/services/client/auth/service';

const resetSchema = z.object({
  newPassword: z.string().min(8, 'A senha deve ter ao menos 8 caracteres.'),
});

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearAuth } = useAuth();
  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);
  const form = useForm(resetSchema, { newPassword: '' });

  const handleSubmit = async (data: { newPassword: string }) => {
    await clientAuthService.resetPassword({ token, newPassword: data.newPassword });
    clearAuth();
    void navigate('/client/login', { replace: true });
  };

  return (
    <PlatformAuthPageLayout>
      <AppForm form={form} onSubmit={handleSubmit}>
        <Typography variant="h4">Redefinir senha</Typography>
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="password"
              label="Nova senha"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
        <Button type="submit" variant="contained" disabled={token.length === 0}>
          Redefinir
        </Button>
      </AppForm>
    </PlatformAuthPageLayout>
  );
};

export default ResetPasswordPage;
