import { useNavigate, useParams } from 'react-router-dom';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { KeyValueGrid } from '@shared/components/data-display/KeyValueGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { toSubscriptionDetailsItems } from '@features/platform/subscriptions/normalizers/subscriptionDetails.normalizer';
import { useSubscriptionDetailsPage } from '@features/platform/subscriptions/hooks/useSubscriptionDetailsPage';

const SubscriptionDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subscriptionDetailsPage = useSubscriptionDetailsPage(id ?? '');

  if (subscriptionDetailsPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando assinatura" />;
  }

  if (subscriptionDetailsPage.errorMessage) {
    return (
      <AppErrorState
        message={subscriptionDetailsPage.errorMessage}
        onRetry={() => {
          void subscriptionDetailsPage.onRetry();
        }}
      />
    );
  }

  if (!subscriptionDetailsPage.entity) {
    return null;
  }

  const subscriptionDetailsItems = toSubscriptionDetailsItems(subscriptionDetailsPage.entity);

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={subscriptionDetailsPage.entity.tenant?.name ?? 'Detalhes da assinatura'}
        subtitle="Consulte dados do tenant, plano contratado e ciclo atual da assinatura."
        actions={
          <AppButton
            variant="outlined"
            onClick={() => {
              void navigate(
                `/platform/subscriptions/${subscriptionDetailsPage.entity?.id}/edit?tenantId=${subscriptionDetailsPage.entity?.tenantId}`,
                { state: { entity: subscriptionDetailsPage.entity } },
              );
            }}
          >
            Editar
          </AppButton>
        }
        actionLabel="Voltar"
        onAction={subscriptionDetailsPage.onBack}
      />
      <SectionCard title="Assinatura">
        <KeyValueGrid items={subscriptionDetailsItems.subscription} />
      </SectionCard>
      <SectionCard title="Tenant">
        <KeyValueGrid items={subscriptionDetailsItems.tenant} />
      </SectionCard>
      <SectionCard title="Plano">
        <KeyValueGrid items={subscriptionDetailsItems.plan} />
      </SectionCard>
    </AppStack>
  );
};

export default SubscriptionDetailsPage;
