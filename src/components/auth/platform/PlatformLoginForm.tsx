import { memo } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { AppForm } from '../../common/form/AppForm';
import { FormTextField } from '../../common/form/FormTextField';
import { useForm } from '../../../forms/useForm';
import {
  loginSchema,
  totpCodeSchema,
  type LoginSchema,
  type TotpCodeSchema,
} from '../../../forms/validators';

interface PlatformLoginFormProps {
  onSubmitLogin: (data: LoginSchema) => Promise<void>;
  onSubmitTotp: (data: TotpCodeSchema) => Promise<void>;
  loading: boolean;
  showTotp: boolean;
}

export const PlatformLoginForm = memo(
  ({ onSubmitLogin, onSubmitTotp, loading, showTotp }: PlatformLoginFormProps) => {
    const loginForm = useForm(loginSchema, { email: '', password: '' });
    const totpForm = useForm(totpCodeSchema, { totpCode: '' });

    if (showTotp) {
      return (
        <AppForm form={totpForm} onSubmit={onSubmitTotp}>
          <Typography variant="h1">Verificação MFA</Typography>
          <FormTextField<TotpCodeSchema> name="totpCode" label="Código TOTP" type="text" />
          <Button
            type="submit"
            variant="contained"
            disabled={!totpForm.formState.isValid || loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Verificar'}
          </Button>
        </AppForm>
      );
    }

    return (
      <AppForm form={loginForm} onSubmit={onSubmitLogin}>
        <Typography variant="h1">Acesse sua conta</Typography>
        <Stack spacing={2}>
          <FormTextField<LoginSchema> name="email" label="E-mail" type="email" />
          <FormTextField<LoginSchema> name="password" label="Senha" type="password" />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          disabled={!loginForm.formState.isValid || loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Entrar'}
        </Button>
      </AppForm>
    );
  },
);
