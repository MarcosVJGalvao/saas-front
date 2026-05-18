import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';
import { translateEnrollmentStatus } from '@shared/i18n/pt-BR/enums';

type StudentEnrollmentsListPresentationParams = {
  buildRowActions: (row: StudentEnrollment) => RowActionItem[];
};

const getStudentName = (row: StudentEnrollment): string => row.student?.person?.fullName ?? '-';

const getEnrollmentCode = (row: StudentEnrollment): string => row.enrollmentCode ?? '-';

const renderStatus = (row: StudentEnrollment) => (
  <LocalizedStatusBadge
    label={translateEnrollmentStatus(row.status)}
    tone={row.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (
  row: StudentEnrollment,
  buildRowActions: (row: StudentEnrollment) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações da matrícula ${getEnrollmentCode(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildStudentEnrollmentsTableColumns = ({
  buildRowActions,
}: StudentEnrollmentsListPresentationParams): DataTableColumn<StudentEnrollment>[] => [
  {
    key: 'student',
    header: 'Aluno',
    render: getStudentName,
    mobileRender: getStudentName,
  },
  {
    key: 'code',
    header: 'Matrícula',
    render: getEnrollmentCode,
    mobileRender: getEnrollmentCode,
  },
  {
    key: 'academicYear',
    header: 'Ano letivo',
    render: (row) => row.academicYear?.name ?? '-',
    mobileRender: (row) => row.academicYear?.name ?? '-',
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) => translateEnrollmentStatus(row.status),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildStudentEnrollmentsMobileConfig = ({
  buildRowActions,
}: StudentEnrollmentsListPresentationParams): DataListMobileConfig<StudentEnrollment> => ({
  renderTitle: getStudentName,
  renderSubtitle: (row) => getEnrollmentCode(row),
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Ano letivo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {row.academicYear?.name ?? '-'}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Turma
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {row.schoolClass?.name ?? '-'}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Data da matrícula
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {row.enrollmentDate}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
