import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import type { FilterField } from '@shared/components/data-display/data/listFilters.types';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { useFinancialTransactionsPageViewModel } from '@features/client/financial/hooks/useFinancialTransactionsPageViewModel';

const filterFields: FilterField[] = [
  {
    type: 'text',
    name: 'query',
    label: 'Buscar',
    placeholder: 'Descrição',
    mobileOrder: 1,
  },
  {
    type: 'select',
    name: 'type',
    label: 'Tipo',
    placeholder: 'Todos os tipos',
    options: [
      { value: 'income', label: 'Entrada' },
      { value: 'expense', label: 'Saída' },
      { value: 'reversal_income', label: 'Estorno de entrada' },
      { value: 'reversal_expense', label: 'Estorno de saída' },
    ],
    mobileOrder: 2,
  },
  {
    type: 'select',
    name: 'originType',
    label: 'Origem',
    placeholder: 'Todas origens',
    options: [
      { value: 'accounts_payable', label: 'Contas a pagar' },
      { value: 'accounts_receivable', label: 'Contas a receber' },
      { value: 'manual', label: 'Manual' },
      { value: 'reversal', label: 'Estorno' },
    ],
    mobileOrder: 3,
  },
  {
    type: 'select',
    name: 'status',
    label: 'Status',
    placeholder: 'Todos os status',
    options: [
      { value: 'open', label: 'Aberto' },
      { value: 'partially_paid', label: 'Parcialmente pago' },
      { value: 'paid', label: 'Pago' },
      { value: 'received', label: 'Recebido' },
      { value: 'overdue', label: 'Em atraso' },
      { value: 'cancelled', label: 'Cancelado' },
      { value: 'reversed', label: 'Estornado' },
    ],
    mobileOrder: 4,
  },
  {
    type: 'dateRange',
    name: 'period',
    label: 'Período',
    startName: 'startDate',
    endName: 'endDate',
    mobileOrder: 5,
  },
];

const FinancialTransactionsPage = () => {
  const model = useFinancialTransactionsPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Transações financeiras"
        subtitle="Consulte movimentações geradas por pagamentos, recebimentos e estornos."
      />
      <ListFilters
        fields={filterFields}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.list.loading}
      />
      <QueryDataTable
        rows={model.list.rows}
        columns={model.columns}
        mobileConfig={model.mobileConfig}
        meta={model.list.meta}
        loading={model.list.loading}
        errorMessage={model.list.errorMessage}
        onRetry={() => {
          void model.list.reload();
        }}
        query={model.query}
        onQueryChange={model.onQueryChange}
        onPageChange={model.onPageChange}
        onRowsPerPageChange={model.onLimitChange}
        emptyTitle="Nenhuma transação encontrada"
        emptyDescription="Movimentações financeiras serão exibidas conforme o período filtrado."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para consultar origem, tipo, status e período.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default FinancialTransactionsPage;
