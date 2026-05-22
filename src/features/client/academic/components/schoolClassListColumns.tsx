import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { translateSchoolClassShift, translateSchoolClassStatus } from '@shared/i18n/pt-BR/enums';
import type { SchoolClass } from '@features/client/academic/types/academic.types';

export interface SchoolClassColumnActions {
  onDetails: (schoolClass: SchoolClass) => void;
  onEdit: (schoolClass: SchoolClass) => void;
}

const getCode = (schoolClass: SchoolClass): string => schoolClass.code ?? '-';

const getShift = (schoolClass: SchoolClass): string =>
  schoolClass.shift ? translateSchoolClassShift(schoolClass.shift) : '-';

const getCapacity = (schoolClass: SchoolClass): string => {
  const currentStudents = schoolClass.currentStudents ?? 0;
  const capacity = schoolClass.maxCapacity ?? 0;
  return capacity > 0 ? `${currentStudents}/${capacity}` : String(currentStudents);
};

const renderStatus = (schoolClass: SchoolClass) => (
  <LocalizedStatusBadge
    label={translateSchoolClassStatus(schoolClass.status)}
    tone={schoolClass.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (schoolClass: SchoolClass, actions: SchoolClassColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações da turma ${schoolClass.name}`}
    actions={[
      { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(schoolClass) },
      { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(schoolClass) },
    ]}
  />
);

export const buildSchoolClassColumns = (
  actions: SchoolClassColumnActions,
): DataTableColumn<SchoolClass>[] => [
  { key: 'name', header: 'Turma', render: (schoolClass) => schoolClass.name },
  { key: 'code', header: 'Código', render: getCode },
  {
    key: 'academicYear',
    header: 'Ano letivo',
    render: (schoolClass) => schoolClass.academicYear?.name ?? '-',
  },
  { key: 'grade', header: 'Série', render: (schoolClass) => schoolClass.grade?.name ?? '-' },
  { key: 'shift', header: 'Turno', render: getShift },
  { key: 'capacity', header: 'Alunos', render: getCapacity },
  { key: 'status', header: 'Status', render: renderStatus },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (schoolClass) => renderActions(schoolClass, actions),
  },
];

export const buildSchoolClassMobileConfig = (
  actions: SchoolClassColumnActions,
): DataListMobileConfig<SchoolClass> => ({
  renderTitle: (schoolClass) => schoolClass.name,
  renderSubtitle: getCode,
  renderStatus,
  renderActions: (schoolClass) => renderActions(schoolClass, actions),
  renderDetails: (schoolClass) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Ano letivo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {schoolClass.academicYear?.name ?? '-'}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Alunos
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getCapacity(schoolClass)}
          </AppText>
        </AppStack>
      </AppStack>
      <AppText variant="body2" color="text.secondary">
        {schoolClass.grade?.name ?? 'Série não informada'} · {getShift(schoolClass)}
      </AppText>
    </AppStack>
  ),
});
