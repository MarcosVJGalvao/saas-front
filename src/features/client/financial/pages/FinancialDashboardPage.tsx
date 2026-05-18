import { AppPaper } from '@shared/components/data-display/AppPaper';
import { AppSkeleton } from '@shared/components/data-display/AppSkeleton';
import { AppText } from '@shared/components/data-display/AppText';
import { EntitySummaryCards } from '@shared/components/data-display/EntitySummaryCards';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { layoutSpacing } from '@theme/spacing';
import { useFinancialDashboardPageViewModel } from '@features/client/financial/hooks/useFinancialDashboardPageViewModel';

const FinancialDashboardPage = () => {
  const model = useFinancialDashboardPageViewModel();

  if (model.loading) {
    return (
      <AppStack spacing={2}>
        <PageHeader
          title="Dashboard financeiro"
          subtitle="Acompanhe indicadores financeiros da escola."
        />
        <AppSkeleton lines={6} height={72} ariaLabel="Carregando dashboard financeiro" />
      </AppStack>
    );
  }

  if (model.errorMessage) {
    return (
      <AppStack spacing={2}>
        <PageHeader
          title="Dashboard financeiro"
          subtitle="Acompanhe indicadores financeiros da escola."
        />
        <AppErrorState
          message={model.errorMessage}
          onRetry={() => {
            void model.reload();
          }}
        />
      </AppStack>
    );
  }

  if (model.empty) {
    return (
      <AppStack spacing={2}>
        <PageHeader
          title="Dashboard financeiro"
          subtitle="Acompanhe indicadores financeiros da escola."
        />
        <EmptyState
          title="Dashboard sem dados"
          description="Indicadores financeiros serão exibidos quando houver movimentação."
        />
      </AppStack>
    );
  }

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Dashboard financeiro"
        subtitle="Acompanhe indicadores, recortes e pendências financeiras da escola."
      />
      <EntitySummaryCards cards={model.cards} />
      <AppPaper sx={{ p: layoutSpacing.cardPadding, borderRadius: 2 }}>
        <AppStack spacing={1}>
          <AppText variant="h6">Próximos recortes</AppText>
          <AppText color="text.secondary">
            Em breve esta área exibirá evolução por período, comparação entre entradas e saídas e
            recortes por turma.
          </AppText>
        </AppStack>
      </AppPaper>
    </AppStack>
  );
};

export default FinancialDashboardPage;
