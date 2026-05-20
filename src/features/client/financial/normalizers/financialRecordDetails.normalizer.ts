import { formatIsoDate } from '@shared/formatters';
import { formatCurrency } from '@shared/formatters/currencyFormatter';
import { translateFinancialRecordStatus } from '@shared/i18n/pt-BR/enums';
import type { DetailsHeaderData, DetailTab } from '@shared/types/detailsDrawer';
import type { FinancialRecord } from '@features/client/financial/types/financial.types';

const getDescription = (record: FinancialRecord): string =>
  record.description ?? record.name ?? '-';
const getAmount = (record: FinancialRecord): string =>
  record.amount === undefined ? '-' : formatCurrency(record.amount, 'BRL');
const toDate = (value: string | undefined): string => (value ? formatIsoDate(value) : '-');
const getSettlementDate = (record: FinancialRecord): string =>
  toDate(record.paymentDate ?? record.receivedDate);

export const toFinancialRecordHeaderData = (
  record: FinancialRecord,
  fallbackSubtitle: string,
): DetailsHeaderData => ({
  title: getDescription(record),
  subtitle: getAmount(record) === '-' ? fallbackSubtitle : getAmount(record),
  avatarFallback: 'F',
  statusLabel: translateFinancialRecordStatus(record.status),
  statusColor: record.status === 'paid' || record.status === 'received' ? 'success' : 'default',
});

export const toFinancialRecordDetailsTabs = (record: FinancialRecord): DetailTab[] => [
  {
    id: 'summary',
    label: 'Resumo',
    sections: [
      {
        id: 'main',
        title: 'Dados financeiros',
        items: [
          { label: 'Descrição', value: getDescription(record) },
          { label: 'Status', value: translateFinancialRecordStatus(record.status) },
          { label: 'Valor', value: getAmount(record) },
          { label: 'Vencimento', value: toDate(record.dueDate) },
          { label: 'Data de baixa', value: getSettlementDate(record) },
          { label: 'Categoria', value: record.category?.name ?? '-' },
          { label: 'Centro de custo', value: record.costCenter?.name ?? '-' },
          { label: 'Aluno', value: record.student?.person?.fullName ?? '-' },
        ],
      },
      {
        id: 'control',
        title: 'Controle',
        items: [
          { label: 'Criado em', value: toDate(record.createdAt) },
          { label: 'Atualizado em', value: toDate(record.updatedAt) },
        ],
      },
    ],
  },
];
