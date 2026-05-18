import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import { translateStudentStatus } from '@shared/i18n/pt-BR/enums';
import type { Student } from '@features/client/students/types/student.types';

type StudentsListPresentationParams = {
  buildRowActions: (row: Student) => RowActionItem[];
};

const getStudentName = (row: Student): string => row.person?.fullName ?? '-';

const getRegistrationCode = (row: Student): string => row.registrationCode ?? '-';

const getDocumentNumber = (row: Student): string => {
  const documentNumber = row.person?.documentNumber;
  if (!documentNumber) return '-';

  const digits = onlyDigits(documentNumber);
  if (row.person?.documentType === 'CPF' || digits.length === 11) return maskCpf(digits);
  if (row.person?.documentType === 'CNPJ' || digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const getCurrentEnrollment = (row: Student): string => {
  const enrollment = row.enrollments?.[0];
  if (!enrollment) return '-';
  return (
    enrollment.schoolClass?.name ??
    enrollment.academicYear?.name ??
    enrollment.enrollmentCode ??
    '-'
  );
};

const renderStatus = (row: Student) => (
  <LocalizedStatusBadge
    label={translateStudentStatus(row.status)}
    tone={row.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (row: Student, buildRowActions: (row: Student) => RowActionItem[]) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do aluno ${getStudentName(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildStudentsTableColumns = ({
  buildRowActions,
}: StudentsListPresentationParams): DataTableColumn<Student>[] => [
  {
    key: 'student',
    header: 'Aluno',
    render: getStudentName,
    mobileRender: getStudentName,
  },
  {
    key: 'registration',
    header: 'Código',
    render: getRegistrationCode,
    mobileRender: getRegistrationCode,
  },
  {
    key: 'document',
    header: 'Documento',
    render: getDocumentNumber,
    mobileRender: getDocumentNumber,
  },
  {
    key: 'class',
    header: 'Turma atual',
    render: getCurrentEnrollment,
    mobileRender: getCurrentEnrollment,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) => translateStudentStatus(row.status),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildStudentsMobileConfig = ({
  buildRowActions,
}: StudentsListPresentationParams): DataListMobileConfig<Student> => ({
  renderTitle: getStudentName,
  renderSubtitle: (row) => getDocumentNumber(row),
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Código
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getRegistrationCode(row)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Turma atual
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getCurrentEnrollment(row)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
