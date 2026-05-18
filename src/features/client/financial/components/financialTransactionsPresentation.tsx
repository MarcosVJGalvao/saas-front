import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import type { RowActionItem } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import {
  translateFinancialOriginType,
  translateFinancialRecordStatus,
  translateFinancialTransactionType,
} from '@shared/i18n/pt-BR/enums';
import type { FinancialTransaction } from '@features/client/financial/types/financial.types';

type FinancialTransactionsPresentationParams = {
  buildRowActions: (row: FinancialTransaction) => RowActionItem[];
};

const getDescription = (row: FinancialTransaction): string => row.description || '-';

const getAmount = (row: FinancialTransaction): string =>
  row.amount === undefined ? '-' : formatCurrency(row.amount, 'BRL');

const getDate = (row: FinancialTransaction): string =>
  row.transactionDate ? formatIsoDate(row.transactionDate) : '-';

const getOrigin = (row: FinancialTransaction): string =>
  row.originType ? translateFinancialOriginType(row.originType) : '-';

const renderStatus = (row: FinancialTransaction) =>
  row.status ? (
    <LocalizedStatusBadge
      label={translateFinancialRecordStatus(row.status)}
      tone={row.status === 'paid' || row.status === 'received' ? 'active' : 'neutral'}
    />
  ) : (
    '-'
  );

const renderActions = (
  row: FinancialTransaction,
  buildRowActions: (row: FinancialTransaction) => RowActionItem[],
) => (
  <RowActionsMenu
    triggerAriaLabel={`Abrir ações de ${getDescription(row)}`}
    actions={buildRowActions(row)}
  />
);

export const buildFinancialTransactionsTableColumns = ({
  buildRowActions,
}: FinancialTransactionsPresentationParams): DataTableColumn<FinancialTransaction>[] => [
  {
    key: 'description',
    header: 'Descrição',
    render: getDescription,
    mobileRender: getDescription,
  },
  {
    key: 'type',
    header: 'Tipo',
    render: (row) => translateFinancialTransactionType(row.type),
    mobileRender: (row) => translateFinancialTransactionType(row.type),
  },
  {
    key: 'origin',
    header: 'Origem',
    render: getOrigin,
    mobileRender: getOrigin,
  },
  {
    key: 'amount',
    header: 'Valor',
    render: getAmount,
    mobileRender: getAmount,
  },
  {
    key: 'date',
    header: 'Data',
    render: getDate,
    mobileRender: getDate,
  },
  {
    key: 'status',
    header: 'Status',
    render: renderStatus,
    mobileRender: (row) => (row.status ? translateFinancialRecordStatus(row.status) : '-'),
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (row) => renderActions(row, buildRowActions),
  },
];

export const buildFinancialTransactionsMobileConfig = ({
  buildRowActions,
}: FinancialTransactionsPresentationParams): DataListMobileConfig<FinancialTransaction> => ({
  renderTitle: getDescription,
  renderSubtitle: getAmount,
  renderStatus,
  renderActions: (row) => renderActions(row, buildRowActions),
  renderDetails: (row) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Tipo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {translateFinancialTransactionType(row.type)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Data
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getDate(row)}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Origem
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {getOrigin(row)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
