import { AppText } from '@shared/components/data-display/AppText';
import { LocalizedStatusBadge } from '@shared/components/data-display/LocalizedStatusBadge';
import type { DataListMobileConfig } from '@shared/components/data-display/data/dataList.types';
import type { DataTableColumn } from '@shared/components/data-display/data/DataTable';
import { RowActionsMenu } from '@shared/components/data-display/data/RowActionsMenu';
import { AppStack } from '@shared/components/layout/AppStack';
import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import {
  translateFinancialOriginType,
  translateFinancialRecordStatus,
  translateFinancialTransactionType,
} from '@shared/i18n/pt-BR/enums';
import type { FinancialTransaction } from '@features/client/financial/types/financial.types';

type FinancialTransactionListActions = {
  onDetails: (transaction: FinancialTransaction) => void;
};

const getDescription = (transaction: FinancialTransaction): string =>
  transaction.description || '-';
const getAmount = (transaction: FinancialTransaction): string =>
  transaction.amount === undefined ? '-' : formatCurrency(transaction.amount, 'BRL');
const getDate = (transaction: FinancialTransaction): string =>
  transaction.transactionDate ? formatIsoDate(transaction.transactionDate) : '-';
const getOrigin = (transaction: FinancialTransaction): string =>
  transaction.originType ? translateFinancialOriginType(transaction.originType) : '-';

const renderStatus = (transaction: FinancialTransaction) =>
  transaction.status ? (
    <LocalizedStatusBadge
      label={translateFinancialRecordStatus(transaction.status)}
      tone={
        transaction.status === 'paid' || transaction.status === 'received' ? 'active' : 'neutral'
      }
    />
  ) : (
    '-'
  );

export const buildFinancialTransactionColumns = (
  actions: FinancialTransactionListActions,
): DataTableColumn<FinancialTransaction>[] => [
  {
    key: 'description',
    header: 'Descrição',
    render: getDescription,
    mobileRender: getDescription,
  },
  {
    key: 'type',
    header: 'Tipo',
    render: (transaction) => translateFinancialTransactionType(transaction.type),
    mobileRender: (transaction) => translateFinancialTransactionType(transaction.type),
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
    mobileRender: (transaction) =>
      transaction.status ? translateFinancialRecordStatus(transaction.status) : '-',
  },
  {
    key: 'actions',
    header: 'Ações',
    align: 'right',
    render: (transaction) => (
      <RowActionsMenu
        triggerAriaLabel={`Abrir ações de ${getDescription(transaction)}`}
        actions={[
          { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(transaction) },
        ]}
      />
    ),
  },
];

export const buildFinancialTransactionMobileConfig = (
  actions: FinancialTransactionListActions,
): DataListMobileConfig<FinancialTransaction> => ({
  renderTitle: getDescription,
  renderSubtitle: getAmount,
  renderStatus,
  renderActions: (transaction) => (
    <RowActionsMenu
      triggerAriaLabel={`Abrir ações de ${getDescription(transaction)}`}
      actions={[
        { key: 'details', label: 'Ver detalhes', onClick: () => actions.onDetails(transaction) },
      ]}
    />
  ),
  renderDetails: (transaction) => (
    <AppStack spacing={1}>
      <AppStack direction="row" sx={{ justifyContent: 'space-between', gap: 2 }}>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Tipo
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {translateFinancialTransactionType(transaction.type)}
          </AppText>
        </AppStack>
        <AppStack spacing={0.5}>
          <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Data
          </AppText>
          <AppText variant="body2" sx={{ fontWeight: 700 }}>
            {getDate(transaction)}
          </AppText>
        </AppStack>
      </AppStack>
      <AppStack spacing={0.5}>
        <AppText variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          Origem
        </AppText>
        <AppText variant="body2" sx={{ fontWeight: 700 }}>
          {getOrigin(transaction)}
        </AppText>
      </AppStack>
    </AppStack>
  ),
});
