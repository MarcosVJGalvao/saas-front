import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import {
  attendanceSummariesColumns,
  attendanceSummariesMobileConfig,
} from '@features/client/attendance/components/attendanceSummariesPresentation';
import {
  buildAttendanceQueryFromFilters,
  useAttendanceFilters,
} from '@features/client/attendance/hooks/useAttendanceFilters';
import { useAttendanceSummariesList } from '@features/client/attendance/hooks/useAttendanceSummariesList';

const AttendanceSummariesPage = () => {
  const list = useAttendanceSummariesList();
  const filters = useAttendanceFilters();

  const applyFilters = (): void => {
    list.updateQuery(buildAttendanceQueryFromFilters(filters.filterValues));
  };

  const clearFilters = (): void => {
    filters.resetFilters();
    list.updateQuery({
      page: 1,
      schoolClassId: undefined,
      subjectId: undefined,
      studentId: undefined,
      status: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Resumos de frequência"
        subtitle="Consulte presença e ausência consolidadas por aluno, turma e disciplina."
      />
      <ListFilters
        fields={[
          {
            type: 'text',
            name: 'schoolClassId',
            label: 'Turma',
            placeholder: 'ID da turma',
            mobileOrder: 1,
          },
          {
            type: 'text',
            name: 'studentId',
            label: 'Aluno',
            placeholder: 'ID do aluno',
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
        values={filters.filterValues}
        onChange={filters.onFilterChange}
        onApply={applyFilters}
        onClear={clearFilters}
        loading={list.loading}
      />
      <QueryDataTable
        rows={list.rows}
        columns={attendanceSummariesColumns}
        mobileConfig={attendanceSummariesMobileConfig}
        meta={list.meta}
        loading={list.loading}
        errorMessage={list.errorMessage}
        onRetry={() => {
          void list.reload();
        }}
        query={list.query.search ?? ''}
        onQueryChange={(search) => list.updateQuery({ search, page: 1 })}
        onPageChange={(page) => list.updateQuery({ page })}
        onRowsPerPageChange={(limit) => list.updateQuery({ limit, page: 1 })}
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
