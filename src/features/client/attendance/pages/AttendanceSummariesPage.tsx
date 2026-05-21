import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useAttendanceSummariesPage } from '@features/client/attendance/hooks/useAttendanceSummariesPage';

const AttendanceSummariesPage = () => {
  const attendanceSummariesPage = useAttendanceSummariesPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Resumos de frequência"
        subtitle="Consulte presença e ausência consolidadas por aluno, turma e disciplina."
      />
      {attendanceSummariesPage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {attendanceSummariesPage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'select',
            name: 'schoolClassId',
            label: 'Turma',
            placeholder: 'Todas as turmas',
            options: attendanceSummariesPage.referenceOptions.schoolClassOptions,
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'studentId',
            label: 'Aluno',
            placeholder: 'Todos os alunos',
            options: attendanceSummariesPage.referenceOptions.studentOptions,
            mobileOrder: 2,
          },
          {
            type: 'select',
            name: 'status',
            label: 'Status',
            placeholder: 'Todos os status',
            options: [
              { value: '', label: 'Todos os status' },
              { value: 'present', label: 'Presente' },
              { value: 'absent', label: 'Ausente' },
              { value: 'justified', label: 'Justificada' },
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
        values={attendanceSummariesPage.filterValues}
        onChange={attendanceSummariesPage.onFilterChange}
        onApply={attendanceSummariesPage.applyFilters}
        onClear={attendanceSummariesPage.clearFilters}
        loading={
          attendanceSummariesPage.attendanceSummariesList.loading ||
          attendanceSummariesPage.referenceOptions.loading
        }
      />
      <QueryDataTable
        rows={attendanceSummariesPage.attendanceSummariesList.rows}
        columns={attendanceSummariesPage.tableColumns}
        mobileConfig={attendanceSummariesPage.mobileConfig}
        meta={attendanceSummariesPage.attendanceSummariesList.meta}
        loading={attendanceSummariesPage.attendanceSummariesList.loading}
        errorMessage={attendanceSummariesPage.attendanceSummariesList.errorMessage}
        onRetry={() => {
          void attendanceSummariesPage.attendanceSummariesList.reload();
        }}
        query={attendanceSummariesPage.attendanceSummariesList.query.search ?? ''}
        onQueryChange={(search) =>
          attendanceSummariesPage.attendanceSummariesList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) =>
          attendanceSummariesPage.attendanceSummariesList.updateQuery({ page })
        }
        onRowsPerPageChange={(limit) =>
          attendanceSummariesPage.attendanceSummariesList.updateQuery({ limit, page: 1 })
        }
        emptyTitle="Nenhum resumo encontrado"
        emptyDescription="Os resumos aparecerão após lançamentos de frequência."
        toolbarContent={
          <AppText color="text.secondary">
            Consulte consolidados por aluno, turma, disciplina e período.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default AttendanceSummariesPage;
