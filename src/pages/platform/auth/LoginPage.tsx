import { useTheme } from '@mui/material/styles';
import { Navigate } from 'react-router-dom';
import { PlatformLoginFormCard } from '@/components/auth/platform/PlatformLoginFormCard';
import { useAuth } from '@/hooks/useAuth/useAuth';
import { usePlatformLoginFlow } from '@/hooks/platform-auth/usePlatformLoginFlow';
import { AUTH_DOMAIN } from '@/models/auth/auth';
import { isAuthenticatedForDomain } from '@/models/auth/guards';
import { PlatformAuthPageLayout } from './PlatformAuthPageLayout';

const PlatformLoginPage = () => {
  const { form, loading, handleSubmit } = usePlatformLoginFlow();
  const { authDomain, flowStep, session } = useAuth();
  const theme = useTheme();
  const isAuthenticated = isAuthenticatedForDomain(
    authDomain,
    flowStep,
    session,
    AUTH_DOMAIN.PLATFORM,
  );

  if (isAuthenticated) {
    return <Navigate to="/platform/home" replace />;
  }

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
