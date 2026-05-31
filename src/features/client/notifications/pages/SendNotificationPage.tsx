import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { NotificationComposerForm } from '@features/client/notifications/components/NotificationComposerForm';
import { useSendNotificationPage } from '@features/client/notifications/hooks/useSendNotificationPage';

const SendNotificationPage = () => {
  const page = useSendNotificationPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Enviar notificação"
        subtitle="Dispare notificações in-app para um ou mais usuários."
      />
      {page.errorMessage ? <AppAlert severity="error">{page.errorMessage}</AppAlert> : null}
      {page.successMessage ? <AppAlert severity="success">{page.successMessage}</AppAlert> : null}
      <NotificationComposerForm model={page} />
    </AppStack>
  );
};

export default SendNotificationPage;
