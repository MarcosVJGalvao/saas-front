import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { createOptionalLocalizedStatusBadge } from '@shared/components/data-display/statusBadge.utils';
import {
  translateFinancialOriginType,
  translateFinancialRecordStatus,
  translateFinancialTransactionType,
} from '@shared/i18n/pt-BR/enums';
import type { DetailsHeaderData, DetailTab } from '@shared/types/detailsDrawer';
import type { FinancialTransaction } from '@features/client/financial/types/financial.types';

const getDescription = (transaction: FinancialTransaction): string =>
  transaction.description || '-';
const getAmount = (transaction: FinancialTransaction): string =>
  transaction.amount === undefined ? '-' : formatCurrency(transaction.amount, 'BRL');
const getDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');

const renderTransactionStatus = (status: FinancialTransaction['status'] | undefined) =>
  createOptionalLocalizedStatusBadge(
    status ? translateFinancialRecordStatus(status) : undefined,
    status === 'paid' || status === 'received' ? 'active' : 'neutral',
  );

export const toFinancialTransactionHeaderData = (
  transaction: FinancialTransaction,
): DetailsHeaderData => ({
  title: getDescription(transaction),
  subtitle: getAmount(transaction),
  avatarFallback: 'T',
  statusLabel: transaction.status ? translateFinancialRecordStatus(transaction.status) : undefined,
  statusColor: transaction.status === 'paid' ? 'success' : 'default',
});

export const toFinancialTransactionDetailsTabs = (
  transaction: FinancialTransaction,
): DetailTab[] => [
  {
    id: 'summary',
    label: 'Resumo',
    sections: [
      {
        id: 'main',
        title: 'Dados da transação',
        items: [
          { label: 'Descrição', value: getDescription(transaction) },
          { label: 'Tipo', value: translateFinancialTransactionType(transaction.type) },
          {
            label: 'Origem',
            value: transaction.originType
              ? translateFinancialOriginType(transaction.originType)
              : '-',
          },
          {
            label: 'Status',
            value: renderTransactionStatus(transaction.status),
          },
          { label: 'Valor', value: getAmount(transaction) },
          { label: 'Data da transação', value: getDate(transaction.transactionDate) },
        ],
      },
      {
        id: 'control',
        title: 'Controle',
        items: [
          { label: 'Criado em', value: getDate(transaction.createdAt) },
          { label: 'Atualizado em', value: getDate(transaction.updatedAt) },
        ],
      },
    ],
  },
];
