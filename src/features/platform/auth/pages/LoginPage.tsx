import { Navigate } from 'react-router-dom';
import { PlatformLoginFormCard } from '@features/platform/auth/components/PlatformLoginFormCard';
import { usePlatformLoginPage } from '@features/platform/auth/hooks/usePlatformLoginPage';
import { PlatformAuthPageLayout } from '@shared/components/layout/PlatformAuthPageLayout';

const PlatformLoginPage = () => {
  const model = usePlatformLoginPage();

  if (model.isAuthenticated) {
    return <Navigate to="/platform/home" replace />;
  }

  return (
    <PlatformAuthPageLayout>
      <PlatformLoginFormCard
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
          password: '••••••••••',
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

export default PlatformLoginPage;
