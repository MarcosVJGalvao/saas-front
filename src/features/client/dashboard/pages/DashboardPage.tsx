import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { EntitySummaryCards } from '@shared/components/data-display/EntitySummaryCards';
import { AppErrorState } from '@shared/components/feedback/AppErrorState';
import { AppSkeleton } from '@shared/components/data-display/AppSkeleton';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientDashboardPage } from '@features/client/dashboard/hooks/useClientDashboardPage';

const ClientDashboardPage = () => {
  const page = useClientDashboardPage();

  const cards = [
    {
      key: 'students',
      title: 'Alunos',
      value: page.summary?.totalStudents ?? 0,
      delta: 'Total de alunos cadastrados',
      icon: <GroupOutlinedIcon fontSize="small" color="primary" />,
      color: 'primary.main',
    },
    {
      key: 'active-students',
      title: 'Alunos ativos',
      value: page.summary?.activeStudents ?? 0,
      delta: 'Alunos com matrícula ativa',
      icon: <PersonOutlinedIcon fontSize="small" color="success" />,
      color: 'success.main',
    },
    {
      key: 'classes',
      title: 'Turmas',
      value: page.summary?.totalSchoolClasses ?? 0,
      delta: 'Total de turmas registradas',
      icon: <SchoolOutlinedIcon fontSize="small" color="info" />,
      color: 'info.main',
    },
  ];

  return (
    <AppStack spacing={2}>
      <PageHeader title="Dashboard do Cliente" subtitle="Visão geral de alunos e turmas." />
      {page.loading ? (
        <AppSkeleton lines={3} height={72} ariaLabel="Carregando dashboard" />
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

export default ClientDashboardPage;
