import AddIcon from '@mui/icons-material/Add';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { useStudentEnrollmentsListPageViewModel } from '@features/client/student-enrollments/hooks/useStudentEnrollmentsListPageViewModel';

const StudentEnrollmentsListPage = () => {
  const model = useStudentEnrollmentsListPageViewModel();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Matrículas"
        subtitle="Acompanhe e gerencie matrículas estudantis."
        actionLabel="Nova matrícula"
        actionIcon={<AddIcon />}
        onAction={model.onCreate}
      />
      {model.actionErrorMessage ? (
        <AppAlert severity="error">{model.actionErrorMessage}</AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'query',
            label: 'Buscar',
            placeholder: 'Aluno ou documento',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'enrollmentCode',
            label: 'Código',
            placeholder: 'Código da matrícula',
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'active', label: 'Ativa' },
              { value: 'cancelled', label: 'Cancelada' },
              { value: 'transferred', label: 'Transferida' },
            ],
            mobileOrder: 3,
          },
          {
            type: 'dateRange',
            name: 'period',
            label: 'Período',
            startName: 'startDate',
            endName: 'endDate',
            mobileOrder: 4,
          },
        ]}
        values={model.filterValues}
        onChange={model.onFilterChange}
        onApply={model.applyFilters}
        onClear={model.clearFilters}
        loading={model.list.loading || model.actionLoading}
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
        emptyTitle="Nenhuma matrícula encontrada"
        emptyDescription="Crie uma matrícula para começar."
        toolbarContent={
          <AppText color="text.secondary">Use a busca para filtrar por aluno ou código.</AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={model.deleteDialogOpen}
        title={model.deleteDialogTitle}
        description={model.deleteDialogDescription}
        confirmLabel={model.actionLoading ? 'Removendo...' : 'Remover'}
        onCancel={model.closeDeleteDialog}
        onConfirm={() => {
          void model.confirmDelete();
        }}
      />
    </AppStack>
  );
};

export default StudentEnrollmentsListPage;
