import { httpClient } from '@shared/services/httpClient';
import type { PaginatedResponse } from '@shared/types/pagination';
import { createClientCrudService } from '@features/client/shared/services/createClientCrudService';
import type {
  ClientApiRecord,
  ClientBaseQueryParams,
} from '@features/client/shared/types/clientApi.types';
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

type FinancialQuery = ClientBaseQueryParams & ClientApiRecord;

export const accountsPayableService = {
  ...createClientCrudService<
    FinancialRecord,
    FinancialRecord,
    FinancialRecordPayload,
    FinancialRecordPayload,
    FinancialRecordQueryParams
  >('/api/financial/accounts-payable'),
  async pay(id: string, payload: FinancialRecordPayload): Promise<FinancialRecord> {
    const { data } = await httpClient.post<FinancialRecord>(
      `/api/financial/accounts-payable/${id}/pay`,
      payload,
    );
    return data;
  },
  async cancel(id: string): Promise<FinancialRecord> {
    const { data } = await httpClient.post<FinancialRecord>(
      `/api/financial/accounts-payable/${id}/cancel`,
    );
    return data;
  },
};

export const accountsReceivableService = {
  ...createClientCrudService<
    FinancialRecord,
    FinancialRecord,
    FinancialRecordPayload,
    FinancialRecordPayload,
    FinancialRecordQueryParams
  >('/api/financial/accounts-receivable'),
  async receive(id: string, payload: FinancialRecordPayload): Promise<FinancialRecord> {
    const { data } = await httpClient.post<FinancialRecord>(
      `/api/financial/accounts-receivable/${id}/receive`,
      payload,
    );
    return data;
  },
  async cancel(id: string): Promise<FinancialRecord> {
    const { data } = await httpClient.post<FinancialRecord>(
      `/api/financial/accounts-receivable/${id}/cancel`,
    );
    return data;
  },
};

export const financialCategoryService = createClientCrudService<
  FinancialCategory,
  FinancialCategory,
  FinancialEntityPayload,
  FinancialEntityPayload,
  FinancialEntityQueryParams
>('/api/financial/categories');

export const financialCostCenterService = createClientCrudService<
  FinancialCostCenter,
  FinancialCostCenter,
  FinancialEntityPayload,
  FinancialEntityPayload,
  FinancialEntityQueryParams
>('/api/financial/cost-centers');

export const financialTransactionService = {
  async list(
    params: FinancialTransactionQueryParams,
  ): Promise<PaginatedResponse<FinancialTransaction>> {
    const { data } = await httpClient.get<PaginatedResponse<FinancialTransaction>>(
      '/api/financial/transactions',
      { params },
    );
    return data;
  },
  async getById(id: string): Promise<FinancialTransaction> {
    const { data } = await httpClient.get<FinancialTransaction>(
      `/api/financial/transactions/${id}`,
    );
    return data;
  },
};

export const financialDashboardService = {
  async getSummary(params: FinancialDashboardQueryParams): Promise<FinancialDashboardSummary> {
    const { data } = await httpClient.get<FinancialDashboardSummary>(
      '/api/financial/dashboard/summary',
      { params },
    );
    return data;
  },
  async getCharts(params: FinancialQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>('/api/financial/dashboard/charts', {
      params,
    });
    return data;
  },
};

export const financialReportService = {
  async getCashFlow(params: FinancialQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>('/api/financial/reports/cash-flow', {
      params,
    });
    return data;
  },
  async getAccountsReceivable(params: FinancialQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(
      '/api/financial/reports/accounts-receivable',
      { params },
    );
    return data;
  },
  async getAccountsPayable(params: FinancialQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(
      '/api/financial/reports/accounts-payable',
      { params },
    );
    return data;
  },
  async getSchoolDefaulting(params: FinancialQuery): Promise<ClientApiRecord> {
    const { data } = await httpClient.get<ClientApiRecord>(
      '/api/financial/reports/school-defaulting',
      { params },
    );
    return data;
  },
};
