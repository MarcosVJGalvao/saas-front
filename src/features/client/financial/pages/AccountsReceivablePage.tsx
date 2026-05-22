import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { paymentMethodOptions } from '@shared/constants/selectOptions';
import { useAccountsReceivableListPage } from '@features/client/financial/hooks/useAccountsReceivableListPage';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';

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
      {(accountsReceivablePage.actionErrorMessage ??
      accountsReceivablePage.referenceOptions.errorMessage) ? (
        <AppAlert severity="error">
          {accountsReceivablePage.actionErrorMessage ??
            accountsReceivablePage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
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
            type: 'select',
            name: 'categoryId',
            label: 'Categoria',
            placeholder: 'Todas as categorias',
            options: accountsReceivablePage.referenceOptions.categoryOptions,
            mobileOrder: 3,
          },
          {
            type: 'select',
            name: 'costCenterId',
            label: 'Centro de custo',
            placeholder: 'Todos os centros de custo',
            options: accountsReceivablePage.referenceOptions.costCenterOptions,
            mobileOrder: 4,
          },
          {
            type: 'select',
            name: 'paymentMethod',
            label: 'Método de pagamento',
            placeholder: 'Todos os métodos',
            options: paymentMethodOptions,
            mobileOrder: 5,
          },
          {
            type: 'select',
            name: 'studentId',
            label: 'Aluno',
            placeholder: 'Todos os alunos',
            options: accountsReceivablePage.referenceOptions.studentOptions,
            mobileOrder: 6,
          },
          {
            type: 'select',
            name: 'studentEnrollmentId',
            label: 'Matrícula',
            placeholder: 'Todas as matrículas',
            options: accountsReceivablePage.referenceOptions.studentEnrollmentOptions,
            mobileOrder: 7,
          },
          {
            type: 'select',
            name: 'schoolClassId',
            label: 'Turma',
            placeholder: 'Todas as turmas',
            options: accountsReceivablePage.referenceOptions.schoolClassOptions,
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
          accountsReceivablePage.financialRecordList.loading ||
          accountsReceivablePage.actionLoading ||
          accountsReceivablePage.referenceOptions.loading
        }
      />
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
