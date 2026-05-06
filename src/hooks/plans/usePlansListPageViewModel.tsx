import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { DataTableColumn } from '../../components/common/data/DataTable';
import type { DataListMobileConfig } from '../../components/common/data/dataList.types';
import { RowActionsMenu } from '../../components/common/data/RowActionsMenu';
import { LocalizedStatusBadge } from '../../components/common/display/LocalizedStatusBadge';
import type { Plan } from '../../models/plans';
import { usePlansListPage } from './usePlansListPage';

const translateBillingCycle = (value: Plan['billingCycle']): string =>
  value === 'monthly' ? 'Mensal' : 'Anual';

const formatCurrency = (value: string, currency: string): string => {
  const normalized = Number(value);
  if (Number.isNaN(normalized)) return `${value} ${currency}`;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(normalized);
};

export const usePlansListPageViewModel = () => {
  const view = usePlansListPage();
  const buildPlanActions = (row: Plan) => [
    {
      key: 'view',
      label: 'Ver detalhes',
      onClick: () => void view.navigate(`/platform/plans/${row.id}`),
    },
    {
      key: 'edit',
      label: 'Editar',
      onClick: () => void view.navigate(`/platform/plans/${row.id}/edit`),
    },
    { key: 'delete', label: 'Excluir', onClick: () => view.setDeleteId(row.id) },
  ];

  const columns: DataTableColumn<Plan>[] = [
    {
      key: 'name',
      header: 'Nome',
      width: '1fr',
      render: (row) => row.name,
    },
    {
      key: 'description',
      header: 'Descrição',
      width: '1.8fr',
      render: (row) => row.description ?? '-',
    },
    {
      key: 'price',
      header: 'Preço',
      width: '0.9fr',
      render: (row) => formatCurrency(row.price, row.currency),
    },
    {
      key: 'billingCycle',
      header: 'Ciclo',
      width: '0.8fr',
      render: (row) => translateBillingCycle(row.billingCycle),
    },
    {
      key: 'trialDays',
      header: 'Trial',
      width: '0.7fr',
      render: (row) => `${row.trialDays} dias`,
    },
    {
      key: 'status',
      header: 'Status',
      width: '96px',
      render: (row) => (
        <LocalizedStatusBadge
          label={row.isActive ? 'Ativa' : 'Inativa'}
          tone={row.isActive ? 'active' : 'neutral'}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Criado em',
      width: '120px',
      render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      width: '44px',
      render: (row) => (
        <RowActionsMenu
          triggerAriaLabel={`Abrir ações de ${row.name}`}
          actions={buildPlanActions(row)}
        />
      ),
    },
  ];

  const mobileConfig: DataListMobileConfig<Plan> = {
    renderTitle: (row) => row.name,
    renderStatus: (row) => (
      <LocalizedStatusBadge
        label={row.isActive ? 'Ativa' : 'Inativa'}
        tone={row.isActive ? 'active' : 'neutral'}
      />
    ),
    renderActions: (row) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações de ${row.name}`}
        actions={buildPlanActions(row)}
      />
    ),
    renderDetails: (row) => (
      <Stack spacing={1} sx={{ px: 0 }}>
        <Stack
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            columnGap: 1.5,
            rowGap: 1,
            alignItems: 'start',
          }}
        >
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Descrição
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.description ?? '-'}
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ minWidth: 0, alignItems: 'flex-end', textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Preço
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {formatCurrency(row.price, row.currency)}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            columnGap: 1.5,
            rowGap: 1,
            alignItems: 'start',
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Ciclo
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {translateBillingCycle(row.billingCycle)}
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ alignItems: 'flex-end', textAlign: 'right' }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Trial
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.trialDays} dias
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Criado em
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {new Date(row.createdAt).toLocaleDateString('pt-BR')}
          </Typography>
        </Stack>
      </Stack>
    ),
  };

  return {
    view,
    columns,
    query: view.list.query.search ?? '',
    mobileConfig,
    onQueryChange: (search: string) => view.list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => view.list.updateQuery({ page }),
    onRowsPerPageChange: (limit: number) => view.list.updateQuery({ limit, page: 1 }),
  };
};
