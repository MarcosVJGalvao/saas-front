import { Navigate } from 'react-router-dom';
import { PlatformMfaSetupForm } from '@/components/auth/platform/PlatformMfaSetupForm';
import { usePlatformMfaSetupFlow } from '@/hooks/platform-auth/usePlatformMfaSetupFlow';
import { PlatformAuthPageLayout } from './PlatformAuthPageLayout';

const PlatformMfaSetupPage = () => {
  const { totpSetup, challengeToken, form, loading, manualCode, qrCodeUrl, handleSubmit } =
    usePlatformMfaSetupFlow();

  if (totpSetup === null || challengeToken === null) {
    return <Navigate to="/platform/login" replace />;
  }

  return (
    <PlatformAuthPageLayout>
      <PlatformMfaSetupForm
        form={form}
        loading={loading}
        manualCode={manualCode}
        qrCodeUrl={qrCodeUrl}
        onSubmit={handleSubmit}
        header={{
          title: 'Configure sua seguranca',
          subtitle:
            'Escaneie o QR Code abaixo com seu aplicativo autenticador e digite o código de 6 dígitos para ativar a autenticação em duas etapas.',
        }}
        labels={{
          cannotScan: 'Não consegue escanear?',
          useManualCode: 'Use o código manual abaixo:',
          appCode: 'Código do aplicativo',
          rotatingCodeHint: 'O código muda a cada 30 segundos no seu aplicativo.',
          submit: 'Confirmar',
          backToLogin: 'Voltar para o login',
        }}
      />
    </PlatformAuthPageLayout>
  );
};

export default PlatformMfaSetupPage;
