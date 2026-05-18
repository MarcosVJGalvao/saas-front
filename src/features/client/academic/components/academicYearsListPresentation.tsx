import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { AppText } from '@shared/components/data-display/AppText';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import { formatIsoDate } from '@shared/formatters';
import { translateAcademicYearStatus } from '@shared/i18n/pt-BR/enums';
import type { AcademicYear } from '@features/client/academic/types/academic.types';

type AcademicYearsListPresentationParams = {
  buildRowActions: (row: AcademicYear) => RowActionItem[];
};

const getPeriod = (row: AcademicYear): string => {
  const startDate = row.startDate ? formatIsoDate(row.startDate) : '-';
  const endDate = row.endDate ? formatIsoDate(row.endDate) : '-';
  return `${startDate} até ${endDate}`;
};

const renderStatus = (row: AcademicYear) => (
  <LocalizedStatusBadge
    label={translateAcademicYearStatus(row.status)}
    tone={row.status === 'active' ? 'active' : 'neutral'}
  />
);

const renderActions = (
  row: AcademicYear,
  buildRowActions: (row: AcademicYear) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações do ano letivo ${row.name}`}
    actions={buildRowActions(row)}
  />
);

export const buildAcademicYearsTableColumns = ({
  buildRowActions,
}: AcademicYearsListPresentationParams): DataTableColumn<AcademicYear>[] => [
  {
    key: 'name',
    header: 'Ano letivo',
    render: (row) => row.name,
    mobileRender: (row) => row.name,
  },
  {
    key: 'code',
    header: 'Código',
    render: (row) => row.code ?? '-',
    mobileRender: (row) => row.code ?? '-',
  },
  {
    key: 'period',
    header: 'Período',
    render: getPeriod,
    mobileRender: getPeriod,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) => translateAcademicYearStatus(row.status),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildAcademicYearsMobileConfig = ({
  buildRowActions,
}: AcademicYearsListPresentationParams): DataListMobileConfig<AcademicYear> => ({
  renderTitle: (row) => row.name,
  renderSubtitle: (row) => row.code ?? getPeriod(row),
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Período
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getPeriod(row)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
