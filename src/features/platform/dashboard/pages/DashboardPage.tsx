import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PauseCircleOutlinedIcon from '@mui/icons-material/PauseCircleOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import { EntitySummaryCards } from '@shared/components/data-display/EntitySummaryCards';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { AppSkeleton } from '@shared/components/data-display/AppSkeleton';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { usePlatformDashboardPage } from '@features/platform/dashboard/hooks/usePlatformDashboardPage';

const PlatformDashboardPage = () => {
  const page = usePlatformDashboardPage();

  const cards = [
    {
      key: 'total',
      title: 'Clientes',
      value: page.summary?.totalClients ?? 0,
      delta: 'Total de clientes cadastrados',
      icon: <BusinessOutlinedIcon fontSize="small" color="primary" />,
      color: 'primary.main',
    },
    {
      key: 'active',
      title: 'Clientes ativos',
      value: page.summary?.activeClients ?? 0,
      delta: 'Com acesso liberado',
      icon: <CheckCircleOutlinedIcon fontSize="small" color="success" />,
      color: 'success.main',
    },
    {
      key: 'inactive',
      title: 'Clientes inativos',
      value: page.summary?.inactiveClients ?? 0,
      delta: 'Sem acesso ou bloqueados',
      icon: <PauseCircleOutlinedIcon fontSize="small" color="warning" />,
      color: 'warning.main',
    },
    {
      key: 'subscriptions',
      title: 'Assinaturas',
      value: page.summary?.totalSubscriptions ?? 0,
      delta: 'Total de assinaturas registradas',
      icon: <SubscriptionsOutlinedIcon fontSize="small" color="info" />,
      color: 'info.main',
    },
  ];

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Dashboard da Plataforma"
        subtitle="Visão geral de clientes e assinaturas."
      />
      {page.loading ? (
        <AppSkeleton lines={4} height={72} ariaLabel="Carregando dashboard" />
      ) : page.errorMessage ? (
        <AppErrorState
          message={page.errorMessage}
          onRetry={() => {
            void page.reload();
          }}
        />
      ) : (
        <EntitySummaryCards cards={cards} />
      )}
    </AppStack>
  );
};

export default PlatformDashboardPage;
