import { Navigate } from 'react-router-dom';
import { PlatformMfaForm } from '@/components/auth/platform/PlatformMfaForm';
import { usePlatformMfaFlow } from '@/hooks/platform-auth/usePlatformMfaFlow';
import { PlatformAuthPageLayout } from './PlatformAuthPageLayout';

const PlatformMfaPage = () => {
  const { challengeToken, form, loading, handleSubmit } = usePlatformMfaFlow();

  if (challengeToken === null) {
    return <Navigate to="/platform/login" replace />;
  }

  return (
    <PlatformAuthPageLayout>
      <PlatformMfaForm
        form={form}
        loading={loading}
        onSubmit={handleSubmit}
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
