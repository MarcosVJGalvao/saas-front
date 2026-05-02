import { Navigate } from 'react-router-dom';
import { PlatformMfaForm } from '@/components/auth/platform/PlatformMfaForm';
import { usePlatformMfaPageViewModel } from '@/hooks/platform-auth/usePlatformMfaPageViewModel';
import { PlatformAuthPageLayout } from './PlatformAuthPageLayout';

const PlatformMfaPage = () => {
  const model = usePlatformMfaPageViewModel();

  if (model.shouldRedirectToLogin) {
    return <Navigate to="/platform/login" replace />;
  }

  return (
    <PlatformAuthPageLayout>
      <PlatformMfaForm
        form={model.form}
        loading={model.loading}
        onSubmit={model.handleSubmit}
        header={{
          title: 'Verificação em duas etapas',
          subtitle: 'Digite o código de 6 dígitos do seu aplicativo autenticador.',
        }}
        labels={{
          submit: 'Verificar',
          recoveryTitle: 'Não consegue acessar?',
          resetMfa: 'Redefinir MFA',
          backToLogin: 'Voltar para login',
        }}
      />
    </PlatformAuthPageLayout>
  );
};

export default PlatformMfaPage;
