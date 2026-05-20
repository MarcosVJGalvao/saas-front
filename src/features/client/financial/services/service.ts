import { financialEndpoints } from './endpoints';
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

export const financialCategoriesService = {
  async list(params: FinancialCategoryListParams): Promise<FinancialCategoryListResponse> {
    const { data } = await financialEndpoints.listCategories(params);
    return data;
  },
  async getById(id: string): Promise<FinancialCategoryDetailsResponse> {
    const { data } = await financialEndpoints.getCategoryById(id);
    return data;
  },
  async create(payload: FinancialCategoryCreatePayload): Promise<FinancialCategoryCreateResponse> {
    const { data } = await financialEndpoints.createCategory(payload);
    return data;
  },
  async update(
    id: string,
    payload: FinancialCategoryUpdatePayload,
  ): Promise<FinancialCategoryUpdateResponse> {
    const { data } = await financialEndpoints.updateCategory(id, payload);
    return data;
  },
};

export const financialCostCentersService = {
  async list(params: FinancialCostCenterListParams): Promise<FinancialCostCenterListResponse> {
    const { data } = await financialEndpoints.listCostCenters(params);
    return data;
  },
  async getById(id: string): Promise<FinancialCostCenterDetailsResponse> {
    const { data } = await financialEndpoints.getCostCenterById(id);
    return data;
  },
  async create(
    payload: FinancialCostCenterCreatePayload,
  ): Promise<FinancialCostCenterCreateResponse> {
    const { data } = await financialEndpoints.createCostCenter(payload);
    return data;
  },
  async update(
    id: string,
    payload: FinancialCostCenterUpdatePayload,
  ): Promise<FinancialCostCenterUpdateResponse> {
    const { data } = await financialEndpoints.updateCostCenter(id, payload);
    return data;
  },
};

export const accountsPayableService = {
  async list(params: AccountsPayableListParams): Promise<AccountsPayableListResponse> {
    const { data } = await financialEndpoints.listAccountsPayable(params);
    return data;
  },
  async getById(id: string): Promise<AccountsPayableDetailsResponse> {
    const { data } = await financialEndpoints.getAccountsPayableById(id);
    return data;
  },
  async create(payload: AccountsPayableCreatePayload): Promise<AccountsPayableCreateResponse> {
    const { data } = await financialEndpoints.createAccountsPayable(payload);
    return data;
  },
  async update(
    id: string,
    payload: AccountsPayableUpdatePayload,
  ): Promise<AccountsPayableUpdateResponse> {
    const { data } = await financialEndpoints.updateAccountsPayable(id, payload);
    return data;
  },
  async settle(
    id: string,
    payload: AccountsPayableSettlePayload,
  ): Promise<AccountsPayableSettleResponse> {
    const { data } = await financialEndpoints.settleAccountsPayable(id, payload);
    return data;
  },
  async cancel(id: string): Promise<AccountsPayableSettleResponse> {
    const { data } = await financialEndpoints.cancelAccountsPayable(id);
    return data;
  },
};

export const accountsReceivableService = {
  async list(params: AccountsReceivableListParams): Promise<AccountsReceivableListResponse> {
    const { data } = await financialEndpoints.listAccountsReceivable(params);
    return data;
  },
  async getById(id: string): Promise<AccountsReceivableDetailsResponse> {
    const { data } = await financialEndpoints.getAccountsReceivableById(id);
    return data;
  },
  async create(
    payload: AccountsReceivableCreatePayload,
  ): Promise<AccountsReceivableCreateResponse> {
    const { data } = await financialEndpoints.createAccountsReceivable(payload);
    return data;
  },
  async update(
    id: string,
    payload: AccountsReceivableUpdatePayload,
  ): Promise<AccountsReceivableUpdateResponse> {
    const { data } = await financialEndpoints.updateAccountsReceivable(id, payload);
    return data;
  },
  async settle(
    id: string,
    payload: AccountsReceivableSettlePayload,
  ): Promise<AccountsReceivableSettleResponse> {
    const { data } = await financialEndpoints.settleAccountsReceivable(id, payload);
    return data;
  },
  async cancel(id: string): Promise<AccountsReceivableSettleResponse> {
    const { data } = await financialEndpoints.cancelAccountsReceivable(id);
    return data;
  },
};

export const financialTransactionsService = {
  async list(params: FinancialTransactionListParams): Promise<FinancialTransactionListResponse> {
    const { data } = await financialEndpoints.listTransactions(params);
    return data;
  },
  async getById(id: string): Promise<FinancialTransactionDetailsResponse> {
    const { data } = await financialEndpoints.getTransactionById(id);
    return data;
  },
};

export const financialDashboardService = {
  async getSummary(
    params: FinancialDashboardSummaryParams,
  ): Promise<FinancialDashboardSummaryResponse> {
    const { data } = await financialEndpoints.getDashboardSummary(params);
    return data;
  },
  async getCharts(
    params: FinancialDashboardChartsParams,
  ): Promise<FinancialDashboardChartsResponse> {
    const { data } = await financialEndpoints.getDashboardCharts(params);
    return data;
  },
};

export const financialReportsService = {
  async getCashFlow(params: FinancialReportParams): Promise<FinancialReportResponse> {
    const { data } = await financialEndpoints.getCashFlowReport(params);
    return data;
  },
  async getAccountsReceivable(params: FinancialReportParams): Promise<FinancialReportResponse> {
    const { data } = await financialEndpoints.getAccountsReceivableReport(params);
    return data;
  },
  async getAccountsPayable(params: FinancialReportParams): Promise<FinancialReportResponse> {
    const { data } = await financialEndpoints.getAccountsPayableReport(params);
    return data;
  },
  async getSchoolDefaulting(params: FinancialReportParams): Promise<FinancialReportResponse> {
    const { data } = await financialEndpoints.getSchoolDefaultingReport(params);
    return data;
  },
};
