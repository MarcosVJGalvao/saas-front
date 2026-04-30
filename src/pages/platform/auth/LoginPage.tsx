import { useTheme } from '@mui/material/styles';
import { PlatformLoginFormCard } from '@/components/auth/platform/PlatformLoginFormCard';
import { usePlatformLoginFlow } from '@/hooks/platform-auth/usePlatformLoginFlow';
import { PlatformAuthPageLayout } from './PlatformAuthPageLayout';

const PlatformLoginPage = () => {
  const { form, loading, handleSubmit } = usePlatformLoginFlow();
  const theme = useTheme();

  return (
    <PlatformAuthPageLayout>
      <PlatformLoginFormCard
        form={form}
        loading={loading}
        onSubmit={handleSubmit}
        header={{
          title: 'Acesse sua conta',
          subtitle: 'Entre com seu e-mail e senha para continuar.',
        }}
        labels={{
          email: 'E-mail',
          password: 'Senha',
          rememberMe: 'Lembrar de mim',
          forgotPassword: 'Esqueci minha senha',
          submit: 'Entrar',
        }}
        placeholders={{
          email: 'seu@email.com',
          password: '••••••••••',
        }}
        styles={{
          fieldLabelSx: {
            fontSize: 18,
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: -1,
          },
        }}
      />
    </PlatformAuthPageLayout>
  );
};

export default PlatformLoginPage;
