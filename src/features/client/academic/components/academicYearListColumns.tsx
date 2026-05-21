import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import { formatIsoDate } from '@shared/formatters';
import { translateAcademicYearStatus } from '@shared/i18n/pt-BR/enums';
import type { AcademicYear } from '@features/client/academic/types/academic.types';

export interface AcademicYearColumnActions {
  onDetails: (academicYear: AcademicYear) => void;
  onEdit: (academicYear: AcademicYear) => void;
  onClose: (academicYear: AcademicYear) => void;
  onReopen: (academicYear: AcademicYear) => void;
}

const getPeriod = (academicYear: AcademicYear): string => {
  const startDate = academicYear.startDate ? formatIsoDate(academicYear.startDate) : '-';
  const endDate = academicYear.endDate ? formatIsoDate(academicYear.endDate) : '-';
  return `${startDate} até ${endDate}`;
};

const renderStatus = (academicYear: AcademicYear) => (
  <LocalizedStatusBadge
    label={translateAcademicYearStatus(academicYear.status)}
    tone={academicYear.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (academicYear: AcademicYear, actions: AcademicYearColumnActions) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do ano letivo ${academicYear.name}`}
    actions={[
      { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(academicYear) },
      { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(academicYear) },
      { key: 'close', label: 'Fechar ano letivo', onClick: () => actions.onClose(academicYear) },
      {
        key: 'reopen',
        label: 'Reabrir ano letivo',
        onClick: () => actions.onReopen(academicYear),
      },
    ]}
  />
);

export const buildAcademicYearColumns = (
  actions: AcademicYearColumnActions,
): DataTableColumn<AcademicYear>[] => [
  { key: 'name', header: 'Ano letivo', render: (academicYear) => academicYear.name },
  { key: 'period', header: 'Período', render: getPeriod },
  { key: 'status', header: 'Status', render: renderStatus },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (academicYear) => renderActions(academicYear, actions),
  },
];

export const buildAcademicYearMobileConfig = (
  actions: AcademicYearColumnActions,
): DataListMobileConfig<AcademicYear> => ({
  renderTitle: (academicYear) => academicYear.name,
  renderSubtitle: (academicYear) => getPeriod(academicYear),
  renderStatus,
  renderActions: (academicYear) => renderActions(academicYear, actions),
  renderDetails: (academicYear) => (
    <AppStack spacing={1}>
      <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        Período
      </AppText>
      <AppText variant="body2" sx={{ fontWeight: 700 }}>
        {getPeriod(academicYear)}
      </AppText>
    </AppStack>
  ),
});
