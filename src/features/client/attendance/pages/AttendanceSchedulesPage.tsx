import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import {
  attendanceSchedulesColumns,
  attendanceSchedulesMobileConfig,
} from '@features/client/attendance/components/attendanceSchedulesPresentation';
import { useAttendanceSchedulesList } from '@features/client/attendance/hooks/useAttendanceSchedulesList';
import {
  buildAttendanceQueryFromFilters,
  useAttendanceFilters,
} from '@features/client/attendance/hooks/useAttendanceFilters';

const AttendanceSchedulesPage = () => {
  const list = useAttendanceSchedulesList();
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
        title="Horários de frequência"
        subtitle="Configure horários por turma, disciplina, professor e período."
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
            name: 'subjectId',
            label: 'Disciplina',
            placeholder: 'ID da disciplina',
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
        values={filters.filterValues}
        onChange={filters.onFilterChange}
        onApply={applyFilters}
        onClear={clearFilters}
        loading={list.loading}
      />
      <QueryDataTable
        rows={list.rows}
        columns={attendanceSchedulesColumns}
        mobileConfig={attendanceSchedulesMobileConfig}
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
        emptyTitle="Nenhum horário encontrado"
        emptyDescription="Configure horários para liberar lançamentos de frequência."
        toolbarContent={
          <AppText color="text.secondary">
            Turmas sem horários configurados aparecem como agenda vazia para frequência.
          </AppText>
        }
        hideToolbar
      />
    </AppStack>
  );
};

export default AttendanceSchedulesPage;
