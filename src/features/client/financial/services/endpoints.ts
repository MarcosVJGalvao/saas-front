import { httpClient } from '@shared/services/httpClient';
import type {
  AccountsPayableCreatePayload,
  AccountsPayableCreateResponse,
  AccountsPayableDetailsResponse,
  AccountsPayableListParams,
  AccountsPayableListResponse,
  AccountsPayableSettlePayload,
  AccountsPayableSettleResponse,
  AccountsPayableUpdatePayload,
  AccountsPayableUpdateResponse,
  AccountsReceivableCreatePayload,
  AccountsReceivableCreateResponse,
  AccountsReceivableDetailsResponse,
  AccountsReceivableListParams,
  AccountsReceivableListResponse,
  AccountsReceivableSettlePayload,
  AccountsReceivableSettleResponse,
  AccountsReceivableUpdatePayload,
  AccountsReceivableUpdateResponse,
  FinancialCategoryCreatePayload,
  FinancialCategoryCreateResponse,
  FinancialCategoryDetailsResponse,
  FinancialCategoryListParams,
  FinancialCategoryListResponse,
  FinancialCategoryUpdatePayload,
  FinancialCategoryUpdateResponse,
  FinancialCostCenterCreatePayload,
  FinancialCostCenterCreateResponse,
  FinancialCostCenterDetailsResponse,
  FinancialCostCenterListParams,
  FinancialCostCenterListResponse,
  FinancialCostCenterUpdatePayload,
  FinancialCostCenterUpdateResponse,
  FinancialDashboardChartsParams,
  FinancialDashboardChartsResponse,
  FinancialDashboardSummaryParams,
  FinancialDashboardSummaryResponse,
  FinancialReportParams,
  FinancialReportResponse,
  FinancialTransactionDetailsResponse,
  FinancialTransactionListParams,
  FinancialTransactionListResponse,
} from './types';

const FINANCIAL_BASE_PATH = '/api/financial';

export const financialEndpoints = {
  listCategories: (params: FinancialCategoryListParams) =>
    httpClient.get<FinancialCategoryListResponse>(`${FINANCIAL_BASE_PATH}/categories`, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getCategoryById: (id: string) =>
    httpClient.get<FinancialCategoryDetailsResponse>(`${FINANCIAL_BASE_PATH}/categories/${id}`),
  createCategory: (payload: FinancialCategoryCreatePayload) =>
    httpClient.post<FinancialCategoryCreateResponse>(`${FINANCIAL_BASE_PATH}/categories`, payload),
  updateCategory: (id: string, payload: FinancialCategoryUpdatePayload) =>
    httpClient.patch<FinancialCategoryUpdateResponse>(
      `${FINANCIAL_BASE_PATH}/categories/${id}`,
      payload,
    ),

  listCostCenters: (params: FinancialCostCenterListParams) =>
    httpClient.get<FinancialCostCenterListResponse>(`${FINANCIAL_BASE_PATH}/cost-centers`, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getCostCenterById: (id: string) =>
    httpClient.get<FinancialCostCenterDetailsResponse>(`${FINANCIAL_BASE_PATH}/cost-centers/${id}`),
  createCostCenter: (payload: FinancialCostCenterCreatePayload) =>
    httpClient.post<FinancialCostCenterCreateResponse>(
      `${FINANCIAL_BASE_PATH}/cost-centers`,
      payload,
    ),
  updateCostCenter: (id: string, payload: FinancialCostCenterUpdatePayload) =>
    httpClient.patch<FinancialCostCenterUpdateResponse>(
      `${FINANCIAL_BASE_PATH}/cost-centers/${id}`,
      payload,
    ),

  listAccountsPayable: (params: AccountsPayableListParams) =>
    httpClient.get<AccountsPayableListResponse>(`${FINANCIAL_BASE_PATH}/accounts-payable`, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getAccountsPayableById: (id: string) =>
    httpClient.get<AccountsPayableDetailsResponse>(`${FINANCIAL_BASE_PATH}/accounts-payable/${id}`),
  createAccountsPayable: (payload: AccountsPayableCreatePayload) =>
    httpClient.post<AccountsPayableCreateResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-payable`,
      payload,
    ),
  updateAccountsPayable: (id: string, payload: AccountsPayableUpdatePayload) =>
    httpClient.patch<AccountsPayableUpdateResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-payable/${id}`,
      payload,
    ),
  settleAccountsPayable: (id: string, payload: AccountsPayableSettlePayload) =>
    httpClient.post<AccountsPayableSettleResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-payable/${id}/pay`,
      payload,
    ),
  cancelAccountsPayable: (id: string) =>
    httpClient.post<AccountsPayableSettleResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-payable/${id}/cancel`,
    ),

  listAccountsReceivable: (params: AccountsReceivableListParams) =>
    httpClient.get<AccountsReceivableListResponse>(`${FINANCIAL_BASE_PATH}/accounts-receivable`, {
      params: { ...params, sortOrder: params.sortOrder ?? 'DESC' },
    }),
  getAccountsReceivableById: (id: string) =>
    httpClient.get<AccountsReceivableDetailsResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-receivable/${id}`,
    ),
  createAccountsReceivable: (payload: AccountsReceivableCreatePayload) =>
    httpClient.post<AccountsReceivableCreateResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-receivable`,
      payload,
    ),
  updateAccountsReceivable: (id: string, payload: AccountsReceivableUpdatePayload) =>
    httpClient.patch<AccountsReceivableUpdateResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-receivable/${id}`,
      payload,
    ),
  settleAccountsReceivable: (id: string, payload: AccountsReceivableSettlePayload) =>
    httpClient.post<AccountsReceivableSettleResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-receivable/${id}/receive`,
      payload,
    ),
  cancelAccountsReceivable: (id: string) =>
    httpClient.post<AccountsReceivableSettleResponse>(
      `${FINANCIAL_BASE_PATH}/accounts-receivable/${id}/cancel`,
    ),

  listTransactions: (params: FinancialTransactionListParams) =>
    httpClient.get<FinancialTransactionListResponse>(`${FINANCIAL_BASE_PATH}/transactions`, {
      params,
    }),
  getTransactionById: (id: string) =>
    httpClient.get<FinancialTransactionDetailsResponse>(
      `${FINANCIAL_BASE_PATH}/transactions/${id}`,
    ),

  getDashboardSummary: (params: FinancialDashboardSummaryParams) =>
    httpClient.get<FinancialDashboardSummaryResponse>(`${FINANCIAL_BASE_PATH}/dashboard/summary`, {
      params,
    }),
  getDashboardCharts: (params: FinancialDashboardChartsParams) =>
    httpClient.get<FinancialDashboardChartsResponse>(`${FINANCIAL_BASE_PATH}/dashboard/charts`, {
      params,
    }),

  getCashFlowReport: (params: FinancialReportParams) =>
    httpClient.get<FinancialReportResponse>(`${FINANCIAL_BASE_PATH}/reports/cash-flow`, {
      params,
    }),
  getAccountsReceivableReport: (params: FinancialReportParams) =>
    httpClient.get<FinancialReportResponse>(`${FINANCIAL_BASE_PATH}/reports/accounts-receivable`, {
      params,
    }),
  getAccountsPayableReport: (params: FinancialReportParams) =>
    httpClient.get<FinancialReportResponse>(`${FINANCIAL_BASE_PATH}/reports/accounts-payable`, {
      params,
    }),
  getSchoolDefaultingReport: (params: FinancialReportParams) =>
    httpClient.get<FinancialReportResponse>(`${FINANCIAL_BASE_PATH}/reports/school-defaulting`, {
      params,
    }),
};
