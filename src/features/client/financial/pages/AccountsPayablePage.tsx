import { useNavigate } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useAccountsPayableListPage } from '@features/client/financial/hooks/useAccountsPayableListPage';

const AccountsPayablePage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const accountsPayablePage = useAccountsPayableListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Contas a pagar"
        subtitle="Gerencie títulos, pagamentos, cancelamentos e recorrências."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('finance:create')}
        onAction={() => {
          void navigate('/client/financial/accounts-payable/new');
        }}
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
            mobileOrder: 2,
          },
          {
            type: 'text',
            name: 'categoryId',
            label: 'Categoria',
            placeholder: 'ID da categoria',
            mobileOrder: 3,
          },
          {
            type: 'text',
            name: 'costCenterId',
            label: 'Centro de custo',
            placeholder: 'ID do centro',
            mobileOrder: 4,
          },
          {
            type: 'text',
            name: 'paymentMethod',
            label: 'Método de pagamento',
            placeholder: 'pix, cash, credit_card...',
            mobileOrder: 5,
          },
          {
            type: 'dateRange',
            name: 'period',
            label: 'Período',
            startName: 'startDate',
            endName: 'endDate',
            mobileOrder: 9,
          },
        ]}
        values={accountsPayablePage.filterValues}
        onChange={accountsPayablePage.onFilterChange}
        onApply={accountsPayablePage.applyFilters}
        onClear={accountsPayablePage.clearFilters}
        loading={
          accountsPayablePage.financialRecordList.loading || accountsPayablePage.actionLoading
        }
      />
      {accountsPayablePage.actionErrorMessage ? (
        <AppAlert severity="error">{accountsPayablePage.actionErrorMessage}</AppAlert>
      ) : null}
      <QueryDataTable
        rows={accountsPayablePage.financialRecordList.rows}
        columns={accountsPayablePage.tableColumns}
        mobileConfig={accountsPayablePage.mobileConfig}
        meta={accountsPayablePage.financialRecordList.meta}
        loading={accountsPayablePage.financialRecordList.loading}
        errorMessage={accountsPayablePage.financialRecordList.errorMessage}
        onRetry={() => {
          void accountsPayablePage.financialRecordList.reload();
        }}
        query={accountsPayablePage.financialRecordList.query.search ?? ''}
        onQueryChange={(search) =>
          accountsPayablePage.financialRecordList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => accountsPayablePage.financialRecordList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          accountsPayablePage.financialRecordList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhuma conta a pagar encontrada"
        emptyDescription="Cadastre obrigações financeiras para acompanhar vencimentos."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para consultar status, categoria, centro de custo, método e período.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={accountsPayablePage.actionDialogOpen}
        title={accountsPayablePage.actionDialogTitle}
        description={accountsPayablePage.actionDialogDescription}
        confirmLabel={accountsPayablePage.actionDialogConfirmLabel}
        onCancel={accountsPayablePage.closeAction}
        onConfirm={() => {
          void accountsPayablePage.confirmAction();
        }}
      />
    </AppStack>
  );
};

export default AccountsPayablePage;
