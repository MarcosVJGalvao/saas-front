import { AppSkeleton } from '@shared/components/data-display/AppSkeleton';
import { AppText } from '@shared/components/data-display/AppText';
import { EntitySummaryCards } from '@shared/components/data-display/EntitySummaryCards';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { EmptyState } from '@shared/components/feedback/EmptyState';
import { ChartCard } from '@shared/components/charts/ChartCard';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { useFinancialDashboardPage } from '@features/client/financial/hooks/useFinancialDashboardPage';

const FinancialDashboardPage = () => {
  const financialDashboardPage = useFinancialDashboardPage();

  const cards = [
    {
      key: 'receivable',
      title: 'Total a receber',
      value: formatCurrency(financialDashboardPage.summary?.totalReceivable ?? 0, 'BRL'),
      delta: `${financialDashboardPage.summary?.openReceivables ?? 0} registros em aberto`,
      icon: <TrendingUpOutlinedIcon fontSize="small" color="success" />,
      color: 'success.main',
    },
    {
      key: 'payable',
      title: 'Total a pagar',
      value: formatCurrency(financialDashboardPage.summary?.totalPayable ?? 0, 'BRL'),
      delta: `${financialDashboardPage.summary?.openPayables ?? 0} obrigações em aberto`,
      icon: <TrendingDownOutlinedIcon fontSize="small" color="warning" />,
      color: 'warning.main',
    },
    {
      key: 'received',
      title: 'Recebido',
      value: formatCurrency(financialDashboardPage.summary?.totalReceived ?? 0, 'BRL'),
      delta: 'Baixas confirmadas',
      icon: <AccountBalanceWalletOutlinedIcon fontSize="small" color="success" />,
      color: 'success.main',
    },
    {
      key: 'overdue',
      title: 'Em atraso',
      value: formatCurrency(financialDashboardPage.summary?.overdueAmount ?? 0, 'BRL'),
      delta: 'Pendências financeiras',
      icon: <WarningAmberOutlinedIcon fontSize="small" color="error" />,
      color: 'error.main',
    },
  ];

  if (financialDashboardPage.loading) {
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

  if (financialDashboardPage.errorMessage) {
    return (
      <AppStack spacing={2}>
        <PageHeader
          title="Dashboard financeiro"
          subtitle="Acompanhe indicadores financeiros da escola."
        />
        <AppErrorState
          message={financialDashboardPage.errorMessage}
          onRetry={() => {
            void financialDashboardPage.reload();
          }}
        />
      </AppStack>
    );
  }

  if (financialDashboardPage.empty) {
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
      <EntitySummaryCards cards={cards} />
      <ChartCard
        title="Evolução financeira"
        subtitle="Comparação entre entradas e saídas por período."
      >
        <AppText color="text.secondary" variant="body2">
          Gráficos serão exibidos quando dados históricos estiverem disponíveis.
        </AppText>
      </ChartCard>
    </AppStack>
  );
};

export default FinancialDashboardPage;
