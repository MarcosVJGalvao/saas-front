import { AppCircularProgress } from '@shared/components/data-display/AppCircularProgress';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { PlanDetailsContent } from '@features/platform/plans/components/PlanDetailsContent';
import type { Plan } from '@features/platform/plans/types/plans';

interface PlanDetailsStateProps {
  viewState: 'loading' | 'error' | 'ready';
  data: Plan;
  errorMessage?: string | undefined;
  onRetry: () => void;
}

export const PlanDetailsState = ({
  viewState,
  data,
  errorMessage,
  onRetry,
}: PlanDetailsStateProps) => {
  const viewByState = {
    loading: <AppCircularProgress ariaLabel="Carregando detalhes do plano" />,
    error: <AppErrorState message={errorMessage ?? 'Erro ao carregar plano.'} onRetry={onRetry} />,
    ready: (
      <AppStack spacing={2}>
        <PageHeader title="Detalhes do Plano" />
        <PlanDetailsContent data={data} />
      </AppStack>
    ),
  };

  return viewByState[viewState];
};
