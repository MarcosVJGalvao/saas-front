import AddIcon from '@mui/icons-material/Add';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { Client } from '../../../models/clients';
import { ClientFilters } from '../../../components/clients/ClientFilters';
import { ClientsTable } from '../../../components/clients/ClientsTable';
import { DeleteClientDialog } from '../../../components/clients/DeleteClientDialog';
import { PermissionGate } from '../../../components/common/access/PermissionGate';
import { SearchBar } from '../../../components/common/data/SearchBar';
import { useClientsListPage } from '../../../hooks/clients/useClientsListPage';

interface KpiCard {
  title: string;
  value: number;
  delta: string;
  icon: ReactNode;
  color: string;
}

const buildKpiCards = (rows: Client[], total: number): KpiCard[] => {
  const activeCount = rows.filter((item) => item.status === 'active').length;
  const inactiveCount = rows.filter((item) => item.status === 'inactive').length;
  const trialCount = Math.max(0, total - activeCount - inactiveCount);
  return [
    {
      title: 'Total de Clientes',
      value: total,
      delta: '+12 este mês',
      icon: <NorthEastIcon fontSize="inherit" color="success" />,
      color: 'success.main',
    },
    {
      title: 'Clientes Ativos',
      value: activeCount,
      delta: '+9 este mês',
      icon: <NorthEastIcon fontSize="inherit" color="success" />,
      color: 'success.main',
    },
    {
      title: 'Em Trial',
      value: trialCount,
      delta: '0 este mês',
      icon: <NorthEastIcon fontSize="inherit" color="success" />,
      color: 'success.main',
    },
    {
      title: 'Cancelados',
      value: inactiveCount,
      delta: '+3 este mês',
      icon: <SouthEastIcon fontSize="inherit" color="error" />,
      color: 'error.main',
    },
  ];
};

const ClientsHeader = ({ canCreate, onCreate }: { canCreate: boolean; onCreate: () => void }) => (
  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
    <Stack>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Listagem de Clientes
      </Typography>
      <Typography color="text.secondary">
        Gerencie todos os clientes cadastrados na plataforma.
      </Typography>
    </Stack>
    <PermissionGate allowed={canCreate}>
      <Button startIcon={<AddIcon />} variant="contained" onClick={onCreate}>
        Novo Cliente
      </Button>
    </PermissionGate>
  </Stack>
);

const ClientsKpi = ({ cards }: { cards: KpiCard[] }) => (
  <Grid container spacing={1.5}>
    {cards.map((card) => (
      <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {card.title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              {card.value}
            </Typography>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', mt: 0.5 }}>
              {card.icon}
              <Typography variant="caption" color={card.color}>
                {card.delta}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const ClientsToolbar = ({
  query,
  onQueryChange,
  filters,
  onFilterChange,
}: {
  query: string;
  onQueryChange: (search: string) => void;
  filters: ReturnType<typeof useClientsListPage>['list']['query'];
  onFilterChange: (patch: Partial<ReturnType<typeof useClientsListPage>['list']['query']>) => void;
}) => (
  <Stack
    direction={{ xs: 'column', xl: 'row' }}
    spacing={1.5}
    sx={{ alignItems: { xl: 'center' } }}
  >
    <SearchBar
      value={query}
      onChange={onQueryChange}
      placeholder="Buscar por cliente, documento ou e-mail..."
      sx={{ maxWidth: { xs: '100%', xl: 380 } }}
    />
    <ClientFilters value={filters} onChange={onFilterChange} />
    <Button
      variant="outlined"
      startIcon={<DownloadOutlinedIcon />}
      sx={{ minWidth: 132, alignSelf: { xs: 'stretch', xl: 'auto' } }}
    >
      Exportar
    </Button>
  </Stack>
);

const ClientsDetailsDrawer = ({
  open,
  onClose,
  client,
}: {
  open: boolean;
  onClose: () => void;
  client: Client | null;
}) => (
  <Drawer anchor="right" open={open} onClose={onClose}>
    <Stack sx={{ width: 420, p: 2.5 }} spacing={2}>
      <Typography variant="h6">Detalhes do Cliente</Typography>
      {client ? (
        <>
          <Typography variant="h5">{client.legalName}</Typography>
          <Typography color="text.secondary">{client.email}</Typography>
          <Typography>Documento: {client.documentNumber}</Typography>
        </>
      ) : (
        <Typography>Carregando...</Typography>
      )}
    </Stack>
  </Drawer>
);

const ClientsListPage = () => {
  const view = useClientsListPage();
  const cards = buildKpiCards(view.list.rows, view.list.meta.total);

  return (
    <Stack spacing={2.5}>
      <ClientsHeader
        canCreate={view.can('platform:clients:create')}
        onCreate={() => {
          void view.navigate('/platform/clients/onboarding');
        }}
      />
      <ClientsKpi cards={cards} />
      <ClientsToolbar
        query={view.list.query.search ?? ''}
        onQueryChange={(search) => view.list.updateQuery({ search, page: 1 })}
        filters={view.list.query}
        onFilterChange={view.list.updateQuery}
      />
      <ClientsTable
        rows={view.list.rows}
        loading={view.list.loading}
        errorMessage={view.list.errorMessage}
        page={view.list.meta.page}
        limit={view.list.meta.limit}
        total={view.list.meta.total}
        query={view.list.query.search ?? ''}
        onQueryChange={(search) => view.list.updateQuery({ search, page: 1 })}
        onPageChange={(page) => view.list.updateQuery({ page })}
        onLimitChange={(limit) => view.list.updateQuery({ limit, page: 1 })}
        onView={view.setSelectedClientId}
        onEdit={(id) => {
          void view.navigate(`/platform/clients/${id}/edit`);
        }}
        onDelete={view.setDeleteClientId}
      />
      <ClientsDetailsDrawer
        open={view.selectedClientId !== undefined}
        onClose={() => view.setSelectedClientId(undefined)}
        client={view.details.data}
      />
      <DeleteClientDialog
        open={view.deleteClientId !== undefined}
        clientName={view.deleteClientName}
        loading={view.mutations.loading}
        onCancel={() => view.setDeleteClientId(undefined)}
        onConfirm={() => {
          void view.confirmDelete();
        }}
      />
    </Stack>
  );
};

export default ClientsListPage;
