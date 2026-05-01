import { useTheme } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';
import { ClientLoginFormCard } from '@/components/auth/client/ClientLoginFormCard';
import { useClientLoginFlow } from '@/hooks/client-auth/useClientLoginFlow';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { AUTH_DOMAIN } from '@/models/auth/auth';
import { isAuthenticatedForDomain } from '@/models/auth/guards';
import { PlatformAuthPageLayout } from '@/pages/platform/auth/PlatformAuthPageLayout';

const ClientLoginPage = () => {
  const { form, loading, handleSubmit } = useClientLoginFlow();
  const { authDomain, flowStep, session } = useAuth();
  const theme = useTheme();
  const isAuthenticated = isAuthenticatedForDomain(
    authDomain,
    flowStep,
    session,
    AUTH_DOMAIN.CLIENT,
  );

  if (isAuthenticated) {
    return <Navigate to="/client/home" replace />;
  }

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
