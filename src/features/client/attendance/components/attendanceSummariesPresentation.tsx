import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { AppStack } from '@shared/components/layout/AppStack';
import { translateAttendanceStatus } from '@shared/i18n/pt-BR/enums';
import type { AttendanceSummary } from '@features/client/attendance/types/attendance.types';

const getStudentName = (row: AttendanceSummary): string => row.student?.person?.fullName ?? '-';

const getClassName = (row: AttendanceSummary): string => row.schoolClass?.name ?? '-';

const getSubjectName = (row: AttendanceSummary): string => row.subject?.name ?? '-';

const getPercentage = (row: AttendanceSummary): string =>
  row.attendancePercentage === undefined ? '-' : `${row.attendancePercentage}%`;

const renderStatus = (row: AttendanceSummary) =>
  row.status ? (
    <LocalizedStatusBadge
      label={translateAttendanceStatus(row.status)}
      tone={row.status === 'present' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

export const attendanceSummariesColumns: DataTableColumn<AttendanceSummary>[] = [
  {
    key: 'student',
    header: 'Aluno',
    render: getStudentName,
    mobileRender: getStudentName,
  },
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
    key: 'present',
    header: 'Presenças',
    render: (row) => row.presentTotal ?? 0,
    mobileRender: (row) => String(row.presentTotal ?? 0),
  },
  {
    key: 'absent',
    header: 'Faltas',
    render: (row) => row.absentTotal ?? 0,
    mobileRender: (row) => String(row.absentTotal ?? 0),
  },
  {
    key: 'percentage',
    header: 'Frequência',
    render: getPercentage,
    mobileRender: getPercentage,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) => (row.status ? translateAttendanceStatus(row.status) : '-'),
  },
];

export const attendanceSummariesMobileConfig: DataListMobileConfig<AttendanceSummary> = {
  renderTitle: getStudentName,
  renderSubtitle: getClassName,
  renderStatus,
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Disciplina
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getSubjectName(row)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Frequência
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getPercentage(row)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
};
