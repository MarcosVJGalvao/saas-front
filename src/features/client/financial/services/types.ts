import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';
import type { PaginatedResponse } from '@shared/types/pagination';
import type {
  FinancialCategory,
  FinancialCostCenter,
  FinancialDashboardQueryParams,
  FinancialDashboardSummary,
  FinancialEntityPayload,
  FinancialEntityQueryParams,
  FinancialRecord,
  FinancialRecordPayload,
  FinancialRecordQueryParams,
  FinancialTransaction,
  FinancialTransactionQueryParams,
} from '@features/client/financial/types/financial.types';

export type FinancialQuery = ClientBaseQueryParams & ClientApiRecord;

export type FinancialCategoryListParams = FinancialEntityQueryParams;
export type FinancialCategoryListResponse = PaginatedResponse<FinancialCategory>;
export type FinancialCategoryDetailsResponse = FinancialCategory;
export type FinancialCategoryCreatePayload = FinancialEntityPayload;
export type FinancialCategoryCreateResponse = FinancialCategory;
export type FinancialCategoryUpdatePayload = Partial<FinancialEntityPayload>;
export type FinancialCategoryUpdateResponse = FinancialCategory;

export type FinancialCostCenterListParams = FinancialEntityQueryParams;
export type FinancialCostCenterListResponse = PaginatedResponse<FinancialCostCenter>;
export type FinancialCostCenterDetailsResponse = FinancialCostCenter;
export type FinancialCostCenterCreatePayload = FinancialEntityPayload;
export type FinancialCostCenterCreateResponse = FinancialCostCenter;
export type FinancialCostCenterUpdatePayload = Partial<FinancialEntityPayload>;
export type FinancialCostCenterUpdateResponse = FinancialCostCenter;

export type AccountsPayableListParams = FinancialRecordQueryParams;
export type AccountsPayableListResponse = PaginatedResponse<FinancialRecord>;
export type AccountsPayableDetailsResponse = FinancialRecord;
export type AccountsPayableCreatePayload = FinancialRecordPayload;
export type AccountsPayableCreateResponse = FinancialRecord;
export type AccountsPayableUpdatePayload = FinancialRecordPayload;
export type AccountsPayableUpdateResponse = FinancialRecord;
export type AccountsPayableSettlePayload = FinancialRecordPayload;
export type AccountsPayableSettleResponse = FinancialRecord;

export type AccountsReceivableListParams = FinancialRecordQueryParams;
export type AccountsReceivableListResponse = PaginatedResponse<FinancialRecord>;
export type AccountsReceivableDetailsResponse = FinancialRecord;
export type AccountsReceivableCreatePayload = FinancialRecordPayload;
export type AccountsReceivableCreateResponse = FinancialRecord;
export type AccountsReceivableUpdatePayload = FinancialRecordPayload;
export type AccountsReceivableUpdateResponse = FinancialRecord;
export type AccountsReceivableSettlePayload = FinancialRecordPayload;
export type AccountsReceivableSettleResponse = FinancialRecord;

export type FinancialTransactionListParams = FinancialTransactionQueryParams;
export type FinancialTransactionListResponse = PaginatedResponse<FinancialTransaction>;
export type FinancialTransactionDetailsResponse = FinancialTransaction;

export type FinancialDashboardSummaryParams = FinancialDashboardQueryParams;
export type FinancialDashboardSummaryResponse = FinancialDashboardSummary;
export type FinancialDashboardChartsParams = FinancialQuery;
export type FinancialDashboardChartsResponse = ClientApiRecord;

export type FinancialReportParams = FinancialQuery;
export type FinancialReportResponse = ClientApiRecord;
