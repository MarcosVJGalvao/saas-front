import { useNavigate } from 'react-router-dom';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useAccountsReceivableListPage } from '@features/client/financial/hooks/useAccountsReceivableListPage';

const AccountsReceivablePage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const accountsReceivablePage = useAccountsReceivableListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Contas a receber"
        subtitle="Gerencie recebíveis vinculados a alunos, matrículas e turmas."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('finance:create')}
        onAction={() => {
          void navigate('/client/financial/accounts-receivable/new');
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
            type: 'text',
            name: 'studentId',
            label: 'Aluno',
            placeholder: 'ID do aluno',
            mobileOrder: 6,
          },
          {
            type: 'text',
            name: 'studentEnrollmentId',
            label: 'Matrícula',
            placeholder: 'ID da matrícula',
            mobileOrder: 7,
          },
          {
            type: 'text',
            name: 'schoolClassId',
            label: 'Turma',
            placeholder: 'ID da turma',
            mobileOrder: 8,
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
        values={accountsReceivablePage.filterValues}
        onChange={accountsReceivablePage.onFilterChange}
        onApply={accountsReceivablePage.applyFilters}
        onClear={accountsReceivablePage.clearFilters}
        loading={
          accountsReceivablePage.financialRecordList.loading || accountsReceivablePage.actionLoading
        }
      />
      {accountsReceivablePage.actionErrorMessage ? (
        <AppAlert severity="error">{accountsReceivablePage.actionErrorMessage}</AppAlert>
      ) : null}
      <QueryDataTable
        rows={accountsReceivablePage.financialRecordList.rows}
        columns={accountsReceivablePage.tableColumns}
        mobileConfig={accountsReceivablePage.mobileConfig}
        meta={accountsReceivablePage.financialRecordList.meta}
        loading={accountsReceivablePage.financialRecordList.loading}
        errorMessage={accountsReceivablePage.financialRecordList.errorMessage}
        onRetry={() => {
          void accountsReceivablePage.financialRecordList.reload();
        }}
        query={accountsReceivablePage.financialRecordList.query.search ?? ''}
        onQueryChange={(search) =>
          accountsReceivablePage.financialRecordList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) => accountsReceivablePage.financialRecordList.updateQuery({ page })}
        onRowsPerPageChange={(limit) =>
          accountsReceivablePage.financialRecordList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhuma conta a receber encontrada"
        emptyDescription="Recebíveis de alunos e matrículas serão exibidos nesta consulta."
        toolbarContent={
          <AppText color="text.secondary">
            Use filtros para consultar status, categoria, centro de custo, método e período.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={accountsReceivablePage.actionDialogOpen}
        title={accountsReceivablePage.actionDialogTitle}
        description={accountsReceivablePage.actionDialogDescription}
        confirmLabel={accountsReceivablePage.actionDialogConfirmLabel}
        onCancel={accountsReceivablePage.closeAction}
        onConfirm={() => {
          void accountsReceivablePage.confirmAction();
        }}
      />
    </AppStack>
  );
};

export default AccountsReceivablePage;
