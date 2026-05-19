import type {
  FinancialCategoryTypeValue,
  FinancialEntityStatusValue,
  FinancialOriginTypeValue,
  FinancialRecordStatusValue,
  FinancialTransactionTypeValue,
} from '@shared/i18n/pt-BR/enums';
import type { ClientBaseQueryParams } from '@features/client/shared/types/clientApi.types';

export type FinancialCategoryType = FinancialCategoryTypeValue;
export type FinancialEntityStatus = FinancialEntityStatusValue;
export type FinancialRecordStatus = FinancialRecordStatusValue;
export type FinancialTransactionType = FinancialTransactionTypeValue;
export type FinancialOriginType = FinancialOriginTypeValue;

export type FinancialCategory = {
  id: string;
  name: string;
  code?: string | undefined;
  type: FinancialCategoryType;
  status?: FinancialEntityStatus | undefined;
  description?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type FinancialCostCenter = {
  id: string;
  name: string;
  code?: string | undefined;
  status?: FinancialEntityStatus | undefined;
  description?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type FinancialEntity = FinancialCategory | FinancialCostCenter;

export type FinancialEntityQueryParams = ClientBaseQueryParams & {
  code?: string | undefined;
  status?: FinancialEntityStatus | undefined;
  type?: FinancialCategoryType | undefined;
};

export type FinancialEntityPayload = {
  name: string;
  code?: string | undefined;
  type?: FinancialCategoryType | undefined;
  status?: FinancialEntityStatus | undefined;
  description?: string | undefined;
};

export type FinancialTransaction = {
  id: string;
  description: string;
  type: FinancialTransactionType;
  originType?: FinancialOriginType | undefined;
  status?: FinancialRecordStatus | undefined;
  amount?: number | undefined;
  transactionDate?: string | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type FinancialTransactionQueryParams = ClientBaseQueryParams & {
  type?: FinancialTransactionType | undefined;
  originType?: FinancialOriginType | undefined;
  status?: FinancialRecordStatus | undefined;
};

export type FinancialRecord = {
  id: string;
  description?: string | undefined;
  name?: string | undefined;
  status: FinancialRecordStatus;
  amount?: number | undefined;
  paymentMethod?: string | undefined;
  dueDate?: string | undefined;
  paymentDate?: string | undefined;
  receivedDate?: string | undefined;
  category?: FinancialCategory | null | undefined;
  costCenter?: FinancialCostCenter | null | undefined;
  student?: {
    id: string;
    person?: {
      fullName?: string | undefined;
    } | null;
  } | null;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type FinancialRecordQueryParams = ClientBaseQueryParams & {
  status?: FinancialRecordStatus | undefined;
  categoryId?: string | undefined;
  costCenterId?: string | undefined;
  studentId?: string | undefined;
  studentEnrollmentId?: string | undefined;
  schoolClassId?: string | undefined;
  paymentMethod?: string | undefined;
};

export type FinancialRecordPayload = Record<string, unknown>;

export type FinancialDashboardSummary = {
  totalReceivable?: number | undefined;
  totalPayable?: number | undefined;
  totalReceived?: number | undefined;
  totalPaid?: number | undefined;
  overdueAmount?: number | undefined;
  openReceivables?: number | undefined;
  openPayables?: number | undefined;
};

export type FinancialDashboardQueryParams = ClientBaseQueryParams & {
  academicYearId?: string | undefined;
};
