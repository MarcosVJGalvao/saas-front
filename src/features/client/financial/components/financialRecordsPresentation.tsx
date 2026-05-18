import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateFinancialRecordStatus } from '@shared/i18n/pt-BR/enums';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

type FinancialRecordsPresentationParams = {
  buildRowActions: (row: FinancialRecord) => RowActionItem[];
  showStudent?: boolean | undefined;
};

const getDescription = (row: FinancialRecord): string => row.description ?? row.name ?? '-';

const getAmount = (row: FinancialRecord): string =>
  row.amount === undefined ? '-' : formatCurrency(row.amount, 'BRL');

const getDueDate = (row: FinancialRecord): string =>
  row.dueDate ? formatIsoDate(row.dueDate) : '-';

const getCategory = (row: FinancialRecord): string => row.category?.name ?? '-';

const getCostCenter = (row: FinancialRecord): string => row.costCenter?.name ?? '-';

const getStudentName = (row: FinancialRecord): string => row.student?.person?.fullName ?? '-';

const renderStatus = (row: FinancialRecord) => (
  <LocalizedStatusBadge
    label={translateFinancialRecordStatus(row.status)}
    tone={row.status === 'paid' || row.status === 'received' ? 'active' : 'neutral'}
  />
);

const renderActions = (
  row: FinancialRecord,
  buildRowActions: (row: FinancialRecord) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${getDescription(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildFinancialRecordsTableColumns = ({
  buildRowActions,
  showStudent = false,
}: FinancialRecordsPresentationParams): DataTableColumn<FinancialRecord>[] => {
  const studentColumns: DataTableColumn<FinancialRecord>[] = showStudent
    ? [
        {
          key: 'student',
          header: 'Aluno',
          render: getStudentName,
          mobileRender: getStudentName,
        },
      ]
    : [];

  return [
    {
      key: 'description',
      header: 'Descrição',
      render: getDescription,
      mobileRender: getDescription,
    },
    ...studentColumns,
    {
      key: 'amount',
      header: 'Valor',
      render: getAmount,
      mobileRender: getAmount,
    },
    {
      key: 'dueDate',
      header: 'Vencimento',
      render: getDueDate,
      mobileRender: getDueDate,
    },
    {
      key: 'category',
      header: 'Categoria',
      render: getCategory,
      mobileRender: getCategory,
    },
    {
      key: 'status',
      header: 'Status',
      render: renderStatus,
      mobileRender: (row) => translateFinancialRecordStatus(row.status),
    },
    {
      key: 'actions',
      header: 'Ações',
      align: 'right',
      render: (row) => renderActions(row, buildRowActions),
    },
  ];
};

export const buildFinancialRecordsMobileConfig = ({
  buildRowActions,
  showStudent = false,
}: FinancialRecordsPresentationParams): DataListMobileConfig<FinancialRecord> => ({
  renderTitle: getDescription,
  renderSubtitle: getAmount,
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      {showStudent ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Aluno
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getStudentName(row)}
          </AppText>
        </AppStack>
      ) : null}
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Vencimento
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getDueDate(row)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Centro de custo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getCostCenter(row)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
