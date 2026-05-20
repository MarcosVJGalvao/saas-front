import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateFinancialRecordStatus } from '@shared/i18n/pt-BR/enums';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

type FinancialRecordListActions = {
  onDetails: (record: FinancialRecord) => void;
  onEdit: (record: FinancialRecord) => void;
  onSettle: (record: FinancialRecord) => void;
  onCancel: (record: FinancialRecord) => void;
};

const getDescription = (record: FinancialRecord): string =>
  record.description ?? record.name ?? '-';
const getAmount = (record: FinancialRecord): string =>
  record.amount === undefined ? '-' : formatCurrency(record.amount, 'BRL');
const getDueDate = (record: FinancialRecord): string =>
  record.dueDate ? formatIsoDate(record.dueDate) : '-';
const getCategory = (record: FinancialRecord): string => record.category?.name ?? '-';
const getCostCenter = (record: FinancialRecord): string => record.costCenter?.name ?? '-';
const getStudentName = (record: FinancialRecord): string => record.student?.person?.fullName ?? '-';

const renderStatus = (record: FinancialRecord) => (
  <LocalizedStatusBadge
    label={translateFinancialRecordStatus(record.status)}
    tone={record.status === 'paid' || record.status === 'received' ? 'active' : 'neutral'}
  />
);

export const buildFinancialRecordColumns = (
  actions: FinancialRecordListActions,
  showStudent: boolean,
  settleLabel: string,
): DataTableColumn<FinancialRecord>[] => [
  {
    key: 'description',
    header: 'Descrição',
    render: getDescription,
    mobileRender: getDescription,
  },
  ...(showStudent
    ? [
        {
          key: 'student',
          header: 'Aluno',
          render: getStudentName,
          mobileRender: getStudentName,
        } satisfies DataTableColumn<FinancialRecord>,
      ]
    : []),
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
    mobileRender: (record) => translateFinancialRecordStatus(record.status),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (record) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações de ${getDescription(record)}`}
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(record) },
          { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(record) },
          { key: 'settle', label: settleLabel, onClick: () => actions.onSettle(record) },
          { key: 'cancel', label: 'Cancelar', onClick: () => actions.onCancel(record) },
        ]}
      />
    ),
  },
];

export const buildFinancialRecordMobileConfig = (
  actions: FinancialRecordListActions,
  showStudent: boolean,
  settleLabel: string,
): DataListMobileConfig<FinancialRecord> => ({
  renderTitle: getDescription,
  renderSubtitle: getAmount,
  renderStatus,
  renderActions: (record) => (
    <RowActionsMenu
      triggerAriaLabel={`Abrir ações de ${getDescription(record)}`}
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(record) },
        { key: 'edit', label: 'Editar', onClick: () => actions.onEdit(record) },
        { key: 'settle', label: settleLabel, onClick: () => actions.onSettle(record) },
        { key: 'cancel', label: 'Cancelar', onClick: () => actions.onCancel(record) },
      ]}
    />
  ),
  renderDetails: (record) => (
    <AppStack spacing={1}>
      {showStudent ? (
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Aluno
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getStudentName(record)}
          </AppText>
        </AppStack>
      ) : null}
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Vencimento
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getDueDate(record)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Centro de custo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getCostCenter(record)}
          </AppText>
        </AppStack>
      </AppStack>
    </AppStack>
  ),
});
