import { memo } from 'react';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppLoadingIndicator } from '@shared/components/data-display/AppLoadingIndicator';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { AppForm } from '@shared/components/form/AppForm';
import { FormTextField } from '@shared/components/form/FormTextField';
import { useAppForm } from '@shared/hooks/useAppForm';
import {
  loginSchema,
  totpCodeSchema,
  type LoginSchema,
  type TotpCodeSchema,
} from '@shared/schemas/authSchemas';

interface PlatformLoginFormProps {
  onSubmitLogin: (data: LoginSchema) => Promise<void>;
  onSubmitTotp: (data: TotpCodeSchema) => Promise<void>;
  loading: boolean;
  showTotp: boolean;
}

export const PlatformLoginForm = memo(
  ({ onSubmitLogin, onSubmitTotp, loading, showTotp }: PlatformLoginFormProps) => {
    const loginForm = useAppForm(loginSchema, { email: '', password: '', rememberMe: false });
    const totpForm = useAppForm(totpCodeSchema, { totpCode: '' });

    if (showTotp) {
      return (
        <AppForm form={totpForm} onSubmit={onSubmitTotp}>
          <AppText variant="h1">Verificação MFA</AppText>
          <FormTextField<TotpCodeSchema> name="totpCode" label="Código TOTP" type="text" />
          <AppButton
            type="submit"
            variant="contained"
            disabled={!totpForm.formState.isValid || loading}
          >
            {loading ? <AppLoadingIndicator size={20} color="inherit" /> : 'Verificar'}
          </AppButton>
        </AppForm>
      );
    }

    return (
      <AppForm form={loginForm} onSubmit={onSubmitLogin}>
        <AppText variant="h1">Acesse sua conta</AppText>
        <AppStack spacing={2}>
          <FormTextField<LoginSchema> name="email" label="E-mail" type="email" />
          <FormTextField<LoginSchema> name="password" label="Senha" type="password" />
        </AppStack>
        <AppButton
          type="submit"
          variant="contained"
          disabled={!loginForm.formState.isValid || loading}
        >
          {loading ? <AppLoadingIndicator size={20} color="inherit" /> : 'Entrar'}
        </AppButton>
      </AppForm>
    );
  },
);
