import { useNavigate } from 'react-router-dom';
import { AppText } from '@shared/components/data-display/AppText';
import { AppAlert } from '@shared/components/feedback/AppAlert';
import { ListFilters } from '@shared/components/data-display/data/ListFilters';
import { QueryDataTable } from '@shared/components/data-display/data/QueryDataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { PageHeader } from '@shared/components/layout/PageHeader';
import { useClientPermission } from '@features/client/shared/hooks/useClientPermission';
import { useAttendanceSchedulesPage } from '@features/client/attendance/hooks/useAttendanceSchedulesPage';

const AttendanceSchedulesPage = () => {
  const navigate = useNavigate();
  const permissions = useClientPermission();
  const attendanceSchedulesPage = useAttendanceSchedulesPage();

  return (
    <AppStack spacing={2}>
      <PageHeader
        title="Horários de frequência"
        subtitle="Configure horários por turma, disciplina, professor e período."
        actionLabel="Cadastrar"
        canShowAction={permissions.can('attendance:create')}
        onAction={() => void navigate('/client/attendance/schedules/new')}
      />
      {attendanceSchedulesPage.referenceOptions.errorMessage ? (
        <AppAlert severity="error">
          {attendanceSchedulesPage.referenceOptions.errorMessage}
        </AppAlert>
      ) : null}
      <ListFilters
        fields={[
          {
            type: 'select',
            name: 'schoolClassId',
            label: 'Turma',
            placeholder: 'Todas as turmas',
            options: attendanceSchedulesPage.referenceOptions.schoolClassOptions,
            mobileOrder: 1,
          },
          {
            type: 'select',
            name: 'subjectId',
            label: 'Disciplina',
            placeholder: 'Todas as disciplinas',
            options: attendanceSchedulesPage.referenceOptions.subjectOptions,
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
        values={attendanceSchedulesPage.filterValues}
        onChange={attendanceSchedulesPage.onFilterChange}
        onApply={attendanceSchedulesPage.applyFilters}
        onClear={attendanceSchedulesPage.clearFilters}
        loading={
          attendanceSchedulesPage.attendanceSchedulesList.loading ||
          attendanceSchedulesPage.referenceOptions.loading
        }
      />
      <QueryDataTable
        rows={attendanceSchedulesPage.attendanceSchedulesList.rows}
        columns={attendanceSchedulesPage.tableColumns}
        mobileConfig={attendanceSchedulesPage.mobileConfig}
        meta={attendanceSchedulesPage.attendanceSchedulesList.meta}
        loading={attendanceSchedulesPage.attendanceSchedulesList.loading}
        errorMessage={attendanceSchedulesPage.attendanceSchedulesList.errorMessage}
        onRetry={() => {
          void attendanceSchedulesPage.attendanceSchedulesList.reload();
        }}
        query={attendanceSchedulesPage.attendanceSchedulesList.query.search ?? ''}
        onQueryChange={(search) =>
          attendanceSchedulesPage.attendanceSchedulesList.updateQuery({ search, page: 1 })
        }
        onPageChange={(page) =>
          attendanceSchedulesPage.attendanceSchedulesList.updateQuery({ page })
        }
        onRowsPerPageChange={(limit) =>
          attendanceSchedulesPage.attendanceSchedulesList.updateQuery({ limit, page: 1 })
        }
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
