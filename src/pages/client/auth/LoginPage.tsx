import { useTheme } from '@mui/material/styles';
import { ClientLoginFormCard } from '@/components/auth/client/ClientLoginFormCard';
import { useClientLoginFlow } from '@/hooks/client-auth/useClientLoginFlow';
import { PlatformAuthPageLayout } from '@/pages/platform/auth/PlatformAuthPageLayout';

const ClientLoginPage = () => {
  const { form, loading, handleSubmit } = useClientLoginFlow();
  const theme = useTheme();

  return (
    <PlatformAuthPageLayout>
      <ClientLoginFormCard
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
          password: '**********',
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

export default ClientLoginPage;
