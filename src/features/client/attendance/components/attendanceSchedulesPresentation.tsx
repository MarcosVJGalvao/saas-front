import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import type { AttendanceSchedule } from '@features/client/attendance/types/attendance.types';

const getClassName = (row: AttendanceSchedule): string => row.schoolClass?.name ?? '-';

const getSubjectName = (row: AttendanceSchedule): string => row.subject?.name ?? '-';

const getTeacherName = (row: AttendanceSchedule): string =>
  row.teacher?.person?.fullName ?? row.teacher?.name ?? '-';

const getTimeRange = (row: AttendanceSchedule): string => {
  if (!row.startTime && !row.endTime) return '-';
  return `${row.startTime ?? '--:--'} às ${row.endTime ?? '--:--'}`;
};

export const attendanceSchedulesColumns: DataTableColumn<AttendanceSchedule>[] = [
  {
    key: 'class',
    header: 'Turma',
    render: getClassName,
    mobileRender: getClassName,
  },
  {
    key: 'subject',
    header: 'Disciplina',
    render: getSubjectName,
    mobileRender: getSubjectName,
  },
  {
    key: 'teacher',
    header: 'Professor',
    render: getTeacherName,
    mobileRender: getTeacherName,
  },
  {
    key: 'weekday',
    header: 'Dia',
    render: (row) => row.weekday ?? '-',
    mobileRender: (row) => row.weekday ?? '-',
  },
  {
    key: 'time',
    header: 'Horário',
    render: getTimeRange,
    mobileRender: getTimeRange,
  },
];

export const attendanceSchedulesMobileConfig: DataListMobileConfig<AttendanceSchedule> = {
  renderTitle: getClassName,
  renderSubtitle: getSubjectName,
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Professor
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getTeacherName(row)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Horário
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getTimeRange(row)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
};
