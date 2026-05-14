import { Navigate } from 'react-router-dom';
import { ClientLoginFormCard } from '@features/client-auth/components/ClientLoginFormCard';
import { useClientLoginPageViewModel } from '@features/client-auth/hooks/useClientLoginPageViewModel';
import { PlatformAuthPageLayout } from '@shared/components/layout/PlatformAuthPageLayout';

const ClientLoginPage = () => {
  const model = useClientLoginPageViewModel();

  if (model.isAuthenticated) {
    return <Navigate to="/client/home" replace />;
  }

  return (
    <PlatformAuthPageLayout>
      <ClientLoginFormCard
        form={model.form}
        loading={model.loading}
        onSubmit={model.handleSubmit}
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
            color: 'text.primary',
            mb: -1,
          },
        }}
      />
    </PlatformAuthPageLayout>
  );
};

export default ClientLoginPage;
