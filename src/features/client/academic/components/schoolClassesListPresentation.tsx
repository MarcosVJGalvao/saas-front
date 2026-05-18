import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { translateSchoolClassShift, translateSchoolClassStatus } from '@shared/i18n/pt-BR/enums';
import type { SchoolClass } from '@features/client/academic/types/academic.types';

type SchoolClassesListPresentationParams = {
  buildRowActions: (row: SchoolClass) => RowActionItem[];
};

const getCode = (row: SchoolClass): string => row.code ?? '-';

const getShift = (row: SchoolClass): string =>
  row.shift ? translateSchoolClassShift(row.shift) : '-';

const getCapacity = (row: SchoolClass): string => {
  const current = row.currentStudents ?? 0;
  const capacity = row.capacity ?? 0;
  return capacity > 0 ? `${current}/${capacity}` : String(current);
};

const renderStatus = (row: SchoolClass) => (
  <LocalizedStatusBadge
    label={translateSchoolClassStatus(row.status)}
    tone={row.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (
  row: SchoolClass,
  buildRowActions: (row: SchoolClass) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações da turma ${row.name}`}
    actions={buildRowActions(row)}
  />
);

export const buildSchoolClassesTableColumns = ({
  buildRowActions,
}: SchoolClassesListPresentationParams): DataTableColumn<SchoolClass>[] => [
  {
    key: 'name',
    header: 'Turma',
    render: (row) => row.name,
    mobileRender: (row) => row.name,
  },
  {
    key: 'code',
    header: 'Código',
    render: getCode,
    mobileRender: getCode,
  },
  {
    key: 'academicYear',
    header: 'Ano letivo',
    render: (row) => row.academicYear?.name ?? '-',
    mobileRender: (row) => row.academicYear?.name ?? '-',
  },
  {
    key: 'grade',
    header: 'Série',
    render: (row) => row.grade?.name ?? '-',
    mobileRender: (row) => row.grade?.name ?? '-',
  },
  {
    key: 'shift',
    header: 'Turno',
    render: getShift,
    mobileRender: getShift,
  },
  {
    key: 'capacity',
    header: 'Alunos',
    render: getCapacity,
    mobileRender: getCapacity,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) => translateSchoolClassStatus(row.status),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildSchoolClassesMobileConfig = ({
  buildRowActions,
}: SchoolClassesListPresentationParams): DataListMobileConfig<SchoolClass> => ({
  renderTitle: (row) => row.name,
  renderSubtitle: getCode,
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
            Alunos
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getCapacity(row)}
          </AppText>
        </AppStack>
      </AppStack>
      <AppText variant="body2" color="text.secondary">
        {row.grade?.name ?? 'Série não informada'} · {getShift(row)}
      </AppText>
    </AppStack>
  ),
});
