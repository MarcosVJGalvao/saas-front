import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useFinancialTransactionsPage } from '@features/client/financial/hooks/useFinancialTransactionsPage';

const FinancialTransactionsPage = () => {
  const financialTransactionsPage = useFinancialTransactionsPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Transações financeiras"
        subtitle="Consulte movimentações geradas por pagamentos, recebimentos e estornos."
      />
      <ListFilters
        fields={[
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
        ]}
        values={financialTransactionsPage.filterValues}
        onChange={financialTransactionsPage.onFilterChange}
        onApply={financialTransactionsPage.applyFilters}
        onClear={financialTransactionsPage.clearFilters}
        loading={financialTransactionsPage.financialTransactionsList.loading}
      />
      <QueryDataTable
        rows={financialTransactionsPage.financialTransactionsList.rows}
        columns={financialTransactionsPage.tableColumns}
        mobileConfig={financialTransactionsPage.mobileConfig}
        meta={financialTransactionsPage.financialTransactionsList.meta}
        loading={financialTransactionsPage.financialTransactionsList.loading}
        errorMessage={financialTransactionsPage.financialTransactionsList.errorMessage}
        onRetry={() => {
          void financialTransactionsPage.financialTransactionsList.reload();
        }}
        query={financialTransactionsPage.financialTransactionsList.query.search ?? ''}
        onQueryChange={(search) =>
          financialTransactionsPage.financialTransactionsList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) =>
          financialTransactionsPage.financialTransactionsList.updateQuery({ page })
        }
        onRowsPerPageChange={(limit) =>
          financialTransactionsPage.financialTransactionsList.updateQuery({ limit, page: 1 })
        }
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
