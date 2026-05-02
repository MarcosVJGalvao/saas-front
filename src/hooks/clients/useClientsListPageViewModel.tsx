import AddIcon from '@mui/icons-material/Add';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { useClientsListPage } from './useClientsListPage';

export const useClientsListPageViewModel = () => {
  const view = useClientsListPage();
  const rows = view.list.rows;
  const total = view.list.meta.total;
  const activeCount = rows.filter((item) => item.status === 'active').length;
  const inactiveCount = rows.filter((item) => item.status === 'inactive').length;
  const trialCount = Math.max(0, total - activeCount - inactiveCount);

  return {
    view,
    pageHeader: {
      title: 'Listagem de Clientes',
      subtitle: 'Gerencie todos os clientes cadastrados na plataforma.',
      actionLabel: 'Novo Cliente',
      actionIcon: <AddIcon />,
      canShowAction: view.can('platform:clients:create'),
      onAction: () => void view.navigate('/platform/clients/onboarding'),
    },
    cards: [
      {
        key: 'total',
        title: 'Total de Clientes',
        value: total,
        delta: '+12 este mês',
        icon: <NorthEastIcon fontSize="inherit" color="success" />,
        color: 'success.main',
      },
      {
        key: 'active',
        title: 'Clientes Ativos',
        value: activeCount,
        delta: '+9 este mês',
        icon: <NorthEastIcon fontSize="inherit" color="success" />,
        color: 'success.main',
      },
      {
        key: 'trial',
        title: 'Em Trial',
        value: trialCount,
        delta: '0 este mês',
        icon: <NorthEastIcon fontSize="inherit" color="success" />,
        color: 'success.main',
      },
      {
        key: 'canceled',
        title: 'Cancelados',
        value: inactiveCount,
        delta: '+3 este mês',
        icon: <SouthEastIcon fontSize="inherit" color="error" />,
        color: 'error.main',
      },
    ],
    exportActionIcon: <DownloadOutlinedIcon />,
    query: view.list.query.search ?? '',
    onQueryChange: (search: string) => view.list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => view.list.updateQuery({ page }),
    onLimitChange: (limit: number) => view.list.updateQuery({ limit, page: 1 }),
    onEdit: (id: string) => void view.navigate(`/platform/clients/${id}/edit`),
  };
};
