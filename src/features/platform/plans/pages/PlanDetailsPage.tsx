import { useNavigate, useParams } from 'react-router-dom';
import { AppButton } from '@shared/components/inputs/AppButton';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { KeyValueGrid } from '@shared/components/data-display/KeyValueGrid';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { SectionCard } from '@shared/components/layout/SectionCard';
import { toPlanDetailsItems } from '@features/platform/plans/normalizers/planDetails.normalizer';
import { usePlanDetailsPage } from '@features/platform/plans/hooks/usePlanDetailsPage';

const PlanDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const planDetailsPage = usePlanDetailsPage(id ?? '');

  if (planDetailsPage.loading) {
    return <AppCircularProgress ariaLabel="Carregando plano" />;
  }

  if (planDetailsPage.errorMessage) {
    return (
      <AppErrorState
        message={planDetailsPage.errorMessage}
        onRetry={() => {
          void planDetailsPage.onRetry();
        }}
      />
    );
  }

  if (!planDetailsPage.entity) {
    return null;
  }

  const planDetailsItems = toPlanDetailsItems(planDetailsPage.entity);

  return (
    <AppStack spacing={2}>
      <PageHeader
        title={planDetailsPage.entity.name}
        subtitle="Consulte dados comerciais e de cobrança do plano."
        actions={
          <AppButton
            variant="outlined"
            onClick={() => {
              void navigate(`/platform/plans/${planDetailsPage.entity?.id}/edit`, {
                state: { entity: planDetailsPage.entity },
              });
            }}
          >
            Editar
          </AppButton>
        }
        actionLabel="Voltar"
        onAction={planDetailsPage.onBack}
      />
      <SectionCard title="Informações gerais">
        <KeyValueGrid items={planDetailsItems.general} />
      </SectionCard>
      <SectionCard title="Controle">
        <KeyValueGrid items={planDetailsItems.control} />
      </SectionCard>
    </AppStack>
  );
};

export default PlanDetailsPage;
