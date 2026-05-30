import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { translateStudentStatus } from '@shared/i18n/pt-BR/enums';
import { maskCnpj, maskCpf } from '@shared/masks/inputMasks';
import { onlyDigits } from '@shared/parsers/stringParsers';
import type { StudentListItem } from '../types/student.types';

export interface StudentListColumnActions {
  onDetails: (student: StudentListItem) => void;
  onEdit: (student: StudentListItem) => void;
  onNewEnrollment: (student: StudentListItem) => void;
}

const getStudentDisplayName = (student: StudentListItem): string => student.fullName;

const getRegistrationCode = (student: StudentListItem): string => student.registrationCode;

const getDocumentNumber = (student: StudentListItem): string => {
  const documentNumber = student.documentNumber;
  const digits = onlyDigits(documentNumber);
  if (digits.length === 11) return maskCpf(digits);
  if (digits.length === 14) return maskCnpj(digits);
  return documentNumber;
};

const getCurrentEnrollment = (student: StudentListItem): string => student.schoolClass?.name ?? '-';

const renderStatus = (student: StudentListItem) => (
  <LocalizedStatusBadge
    label={translateStudentStatus(student.status)}
    tone={student.status === 'active' ? 'active' : 'neutral'}
  />
);

export const buildStudentListColumns = (
  actions: StudentListColumnActions,
): DataTableColumn<StudentListItem>[] => [
  {
    key: 'student',
    header: 'Aluno',
    render: getStudentDisplayName,
    mobileRender: getStudentDisplayName,
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
    mobileRender: (student) => translateStudentStatus(student.status),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (student) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações do aluno ${getStudentDisplayName(student)}`}
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(student) },
          { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(student) },
          {
            key: 'new-enrollment',
            label: 'Nova matrícula',
            onClick: () => actions.onNewEnrollment(student),
          },
        ]}
      />
    ),
  },
];

export const buildStudentMobileConfig = (
  actions: StudentListColumnActions,
): DataListMobileConfig<StudentListItem> => ({
  renderTitle: getStudentDisplayName,
  renderSubtitle: getDocumentNumber,
  renderStatus,
  renderActions: (student) => (
    <RowActionsMenu
      triggerAriaLabel={`Abrir ações do aluno ${getStudentDisplayName(student)}`}
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(student) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(student) },
        {
          key: 'new-enrollment',
          label: 'Nova matrícula',
          onClick: () => actions.onNewEnrollment(student),
        },
      ]}
    />
  ),
  renderDetails: (student) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Código
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getRegistrationCode(student)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Turma atual
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getCurrentEnrollment(student)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
