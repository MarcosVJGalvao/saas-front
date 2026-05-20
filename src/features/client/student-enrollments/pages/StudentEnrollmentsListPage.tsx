import AddIcon from '@mui/icons-material/Add';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ConfirmDialog } from '@shared/components/feedback/ConfirmDialog';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppButton } from '@shared/components/inputs/AppButton';
import { useStudentEnrollmentsListPage } from '@features/client/student-enrollments/hooks/useStudentEnrollmentsListPage';
import { useNavigate } from 'react-router-dom';

const isStudentEnrollmentFilterKey = (
  value: string,
): value is 'search' | 'status' | 'startDate' | 'endDate' =>
  value === 'search' || value === 'status' || value === 'startDate' || value === 'endDate';

const StudentEnrollmentsListPage = () => {
  const navigate = useNavigate();
  const studentEnrollmentsPage = useStudentEnrollmentsListPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Matrículas"
        subtitle="Acompanhe e gerencie matrículas estudantis."
        actions={
          <AppButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              void navigate('/client/student-enrollments/new');
            }}
          >
            Nova matrícula
          </AppButton>
        }
      />
      {studentEnrollmentsPage.actionErrorMessage ? (
        <AppAlert severity="error">{studentEnrollmentsPage.actionErrorMessage}</AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'search',
            label: 'Buscar',
            placeholder: 'Aluno, documento ou código',
            mobileOrder: 1,
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
            mobileOrder: 2,
          },
          {
            type: 'dateRange',
            name: 'period',
            label: 'Período',
            startName: 'startDate',
            endName: 'endDate',
            mobileOrder: 3,
          },
        ]}
        values={studentEnrollmentsPage.filterValues}
        onChange={(filterKey, filterValue) => {
          if (typeof filterValue === 'string' && isStudentEnrollmentFilterKey(filterKey)) {
            studentEnrollmentsPage.onFilterChange(filterKey, filterValue);
          }
        }}
        onApply={studentEnrollmentsPage.applyFilters}
        onClear={studentEnrollmentsPage.clearFilters}
        loading={
          studentEnrollmentsPage.studentEnrollmentsList.loading ||
          studentEnrollmentsPage.deleteModal.isDeleting
        }
      />
      <QueryDataTable
        rows={studentEnrollmentsPage.studentEnrollmentsList.rows}
        columns={studentEnrollmentsPage.tableColumns}
        mobileConfig={studentEnrollmentsPage.mobileConfig}
        meta={studentEnrollmentsPage.studentEnrollmentsList.pagination}
        loading={studentEnrollmentsPage.studentEnrollmentsList.loading}
        errorMessage={studentEnrollmentsPage.studentEnrollmentsList.errorMessage}
        onRetry={() => {
          void studentEnrollmentsPage.studentEnrollmentsList.reload();
        }}
        query={studentEnrollmentsPage.studentEnrollmentsList.queryParams.search ?? ''}
        onQueryChange={(search) =>
          studentEnrollmentsPage.studentEnrollmentsList.updateQueryParams({ search, page: 1 })
        }
        onPageChange={(page) =>
          studentEnrollmentsPage.studentEnrollmentsList.updateQueryParams({ page })
        }
        onRowsPerPageChange={(limit) =>
          studentEnrollmentsPage.studentEnrollmentsList.updateQueryParams({ limit, page: 1 })
        }
        emptyTitle="Nenhuma matrícula encontrada"
        emptyDescription="Crie uma matrícula para começar."
        toolbarContent={
          <AppText color="text.secondary">
            Use a busca geral para filtrar por aluno, documento ou código.
          </AppText>
        }
        hideToolbar
      />
      <ConfirmDialog
        open={Boolean(studentEnrollmentsPage.deleteModal.enrollmentPendingDelete)}
        title="Remover matrícula"
        description={`Confirma a remoção da matrícula ${studentEnrollmentsPage.deleteModal.enrollmentPendingDelete?.enrollmentCode ?? 'selecionada'}?`}
        confirmLabel={studentEnrollmentsPage.deleteModal.isDeleting ? 'Removendo...' : 'Remover'}
        onCancel={studentEnrollmentsPage.deleteModal.close}
        onConfirm={() => {
          void studentEnrollmentsPage.deleteModal.confirm();
        }}
      />
    </AppStack>
  );
};

export default StudentEnrollmentsListPage;
