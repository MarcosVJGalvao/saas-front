import { Navigate } from 'react-router-dom';
import { PlatformMfaSetupForm } from '@features/platform-auth/components/PlatformMfaSetupForm';
import { usePlatformMfaSetupPageViewModel } from '@features/platform-auth/hooks/usePlatformMfaSetupPageViewModel';
import { PlatformAuthPageLayout } from '@shared/components/layout/PlatformAuthPageLayout';

const PlatformMfaSetupPage = () => {
  const model = usePlatformMfaSetupPageViewModel();

  if (model.shouldRedirectToLogin) {
    return <Navigate to="/platform/login" replace />;
  }

  return (
    <PlatformAuthPageLayout>
      <PlatformMfaSetupForm
        form={model.form}
        loading={model.loading}
        submitDisabled={model.isSubmitDisabled}
        manualCode={model.manualCode}
        qrCodeUrl={model.qrCodeUrl}
        onSubmit={model.handleSubmit}
        header={{
          title: 'Configure sua segurança',
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
