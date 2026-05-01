import { memo } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { AppForm } from '../common/form/AppForm';
import { FormTextField } from '../common/form/FormTextField';
import { useForm } from '../../forms/useForm';
import { loginSchema, type LoginSchema } from '../../forms/validators';

interface LoginFormProps {
  onSubmit: (data: LoginSchema) => Promise<void>;
  loading: boolean;
}

export const LoginForm = memo(({ onSubmit, loading }: LoginFormProps) => {
  const form = useForm(loginSchema, { email: '', password: '', rememberMe: false });

  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
        Acessar plataforma
      </Typography>
      <Alert severity="info">Validacao imediata com Zod + RHF.</Alert>
      <FormTextField<LoginSchema> name="email" label="Email" type="email" />
      <FormTextField<LoginSchema> name="password" label="Senha" type="password" />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={!form.formState.isValid || loading}
        aria-busy={loading}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : 'Entrar'}
      </Button>
    </AppForm>
  );
});
