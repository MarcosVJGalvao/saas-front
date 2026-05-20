import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { StudentEnrollment } from '@features/client/student-enrollments/types/studentEnrollment.types';
import { translateEnrollmentStatus } from '@shared/i18n/pt-BR/enums';

export interface StudentEnrollmentColumnActions {
  onDetails: (enrollment: StudentEnrollment) => void;
  onEdit: (enrollment: StudentEnrollment) => void;
  onDownloadContract: (enrollment: StudentEnrollment) => void;
  onDelete: (enrollment: StudentEnrollment) => void;
}

const getStudentName = (enrollment: StudentEnrollment): string =>
  enrollment.student?.person?.fullName ?? '-';

const getEnrollmentCode = (enrollment: StudentEnrollment): string =>
  enrollment.enrollmentCode ?? '-';

const renderStatus = (enrollment: StudentEnrollment) => (
  <LocalizedStatusBadge
    label={translateEnrollmentStatus(enrollment.status)}
    tone={enrollment.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (enrollment: StudentEnrollment, actions: StudentEnrollmentColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações da matrícula ${getEnrollmentCode(enrollment)}`}
    actions={[
      {
        key: 'details',
        label: 'Ver detalhes',
        onClick: () => actions.onDetails(enrollment),
      },
      {
        key: 'edit',
        label: 'Editar',
        onClick: () => actions.onEdit(enrollment),
      },
      {
        key: 'contract',
        label: 'Baixar contrato',
        onClick: () => actions.onDownloadContract(enrollment),
      },
      {
        key: 'delete',
        label: 'Remover',
        onClick: () => actions.onDelete(enrollment),
      },
    ]}
  />
);

export const buildStudentEnrollmentColumns = (
  actions: StudentEnrollmentColumnActions,
): DataTableColumn<StudentEnrollment>[] => [
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
    render: (enrollment) => enrollment.academicYear?.name ?? '-',
    mobileRender: (enrollment) => enrollment.academicYear?.name ?? '-',
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (enrollment) => translateEnrollmentStatus(enrollment.status),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (enrollment) => renderActions(enrollment, actions),
  },
];

export const buildStudentEnrollmentMobileConfig = (
  actions: StudentEnrollmentColumnActions,
): DataListMobileConfig<StudentEnrollment> => ({
  renderTitle: getStudentName,
  renderSubtitle: getEnrollmentCode,
  renderStatus,
  renderActions: (enrollment) => renderActions(enrollment, actions),
  renderDetails: (enrollment) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Ano letivo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {enrollment.academicYear?.name ?? '-'}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Turma
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {enrollment.schoolClass?.name ?? '-'}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Data da matrícula
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {enrollment.enrollmentDate}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
