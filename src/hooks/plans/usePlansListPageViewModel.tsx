import Chip from '@mui/material/Chip';
import type { DataTableColumn } from '../../components/common/data/DataTable';
import { RowActionsMenu } from '../../components/common/data/RowActionsMenu';
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

  const columns: DataTableColumn<Plan>[] = [
    { key: 'name', header: 'Nome', render: (row) => row.name },
    { key: 'description', header: 'Descrição', render: (row) => row.description ?? '-' },
    { key: 'price', header: 'Preço', render: (row) => formatCurrency(row.price, row.currency) },
    {
      key: 'billingCycle',
      header: 'Ciclo',
      render: (row) => translateBillingCycle(row.billingCycle),
    },
    { key: 'trialDays', header: 'Trial', render: (row) => `${row.trialDays} dias` },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Chip
          size="small"
          label={row.isActive ? 'Ativo' : 'Inativo'}
          color={row.isActive ? 'success' : 'default'}
        />
      ),
    },
    {
      key: 'createdAt',
      header: 'Criado em',
      render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      render: (row) => (
        <RowActionsMenu
          actions={[
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
          ]}
        />
      ),
    },
  ];

  return {
    view,
    columns,
    query: view.list.query.search ?? '',
    onQueryChange: (search: string) => view.list.updateQuery({ search, page: 1 }),
    onPageChange: (page: number) => view.list.updateQuery({ page }),
    onRowsPerPageChange: (limit: number) => view.list.updateQuery({ limit, page: 1 }),
  };
};
