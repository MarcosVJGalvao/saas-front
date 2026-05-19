import type {
  FinancialRecord,
  FinancialRecordPayload,
} from '@features/client/financial/types/financial.types';

const todayIsoDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const normalizeAccountsPayableSettlementPayload = (
  record: FinancialRecord | undefined,
): FinancialRecordPayload => ({
  paidAmount: record?.amount ?? 0,
  paymentDate: todayIsoDate(),
  paymentMethod: record?.paymentMethod,
});

export const normalizeAccountsReceivableSettlementPayload = (
  record: FinancialRecord | undefined,
): FinancialRecordPayload => ({
  receivedAmount: record?.amount ?? 0,
  receivedDate: todayIsoDate(),
  paymentMethod: record?.paymentMethod,
});
