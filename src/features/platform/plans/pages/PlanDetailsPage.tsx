import { InfoList } from '@shared/components/data-display/InfoList';
import { AppCard } from '@shared/components/data-display/AppCard';
import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { usePlanDetailsPageViewModel } from '@features/platform/plans/hooks/usePlanDetailsPageViewModel';
import type { Plan } from '@features/platform/plans/types/plans';

const billingCycleLabel: Record<Plan['billingCycle'], string> = {
  monthly: 'Mensal',
  yearly: 'Anual',
};
const PlanDetailsContent = ({ data }: { data: Plan }) => {
  const statusLabel = data.isActive ? 'Ativo' : 'Inativo';
  return (
    <AppCard>
      <InfoList
        items={[
          { label: 'Nome', value: data.name },
          { label: 'Descrição', value: data.description ?? '-' },
          { label: 'Preço', value: `${data.price} ${data.currency}` },
          { label: 'Ciclo', value: billingCycleLabel[data.billingCycle] },
          { label: 'Trial', value: `${data.trialDays} dias` },
          { label: 'Status', value: statusLabel },
          { label: 'Criado em', value: new Date(data.createdAt).toLocaleDateString('pt-BR') },
        ]}
      />
    </AppCard>
  );
};

const PlanDetailsPage = () => {
  const model = usePlanDetailsPageViewModel();

  const viewByState = {
    loading: <AppCircularProgress ariaLabel="Carregando detalhes do plano" />,
    error: (
      <AppErrorState
        message={model.errorMessage ?? 'Erro ao carregar plano.'}
        onRetry={() => void model.refresh()}
      />
    ),
    ready: (
      <AppStack spacing={2}>
        <PageHeader title="Detalhes do Plano" />
        <PlanDetailsContent data={model.data} />
      </AppStack>
    ),
  };

  return viewByState[model.viewState];
};

export default PlanDetailsPage;
