import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  accountsPayableService,
  accountsReceivableService,
  financialDashboardService,
  financialCategoryService,
  financialCostCenterService,
  financialTransactionService,
} from '@features/client/financial/services/financialServices';
import { httpClient } from '@shared/services/httpClient';

describe('financial entity services', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista categorias pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'category-1', name: 'Mensalidades', type: 'revenue', status: 'active' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await financialCategoryService.list({
      page: 1,
      limit: 10,
      type: 'revenue',
    });

    expect(getSpy).toHaveBeenCalledWith('/api/financial/categories', {
      params: { page: 1, limit: 10, type: 'revenue', sortOrder: 'DESC' },
    });
    expect(response.data[0]?.name).toBe('Mensalidades');
  });

  it('busca centro de custo pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { id: 'cost-center-1', name: 'Administrativo', status: 'active' },
    });

    const response = await financialCostCenterService.getById('cost-center-1');

    expect(getSpy).toHaveBeenCalledWith('/api/financial/cost-centers/cost-center-1');
    expect(response.name).toBe('Administrativo');
  });

  it('lista transações financeiras pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [{ id: 'transaction-1', description: 'Mensalidade', type: 'income' }],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    });

    const response = await financialTransactionService.list({
      page: 1,
      limit: 10,
      type: 'income',
    });

    expect(getSpy).toHaveBeenCalledWith('/api/financial/transactions', {
      params: { page: 1, limit: 10, type: 'income' },
    });
    expect(response.data[0]?.description).toBe('Mensalidade');
  });

  it('confirma pagamento pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'payable-1', description: 'Fornecedor', status: 'paid' },
    });

    const response = await accountsPayableService.pay('payable-1', {});

    expect(postSpy).toHaveBeenCalledWith('/api/financial/accounts-payable/payable-1/pay', {});
    expect(response.status).toBe('paid');
  });

  it('confirma recebimento pelo endpoint correto', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: { id: 'receivable-1', description: 'Mensalidade', status: 'received' },
    });

    const response = await accountsReceivableService.receive('receivable-1', {});

    expect(postSpy).toHaveBeenCalledWith(
      '/api/financial/accounts-receivable/receivable-1/receive',
      {},
    );
    expect(response.status).toBe('received');
  });

  it('busca resumo do dashboard pelo endpoint correto', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: { totalReceivable: 1000, totalPayable: 450 },
    });

    const response = await financialDashboardService.getSummary({ page: 1, limit: 1 });

    expect(getSpy).toHaveBeenCalledWith('/api/financial/dashboard/summary', {
      params: { page: 1, limit: 1 },
    });
    expect(response.totalReceivable).toBe(1000);
  });
});
