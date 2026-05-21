import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePlatformSubscriptionReferenceOptions } from '@features/platform/subscriptions/hooks/usePlatformSubscriptionReferenceOptions';
import { clientsService } from '@features/platform/clients/services/service';
import { plansService } from '@features/platform/plans/services/service';

vi.mock('@features/platform/clients/services/service', () => ({
  clientsService: { list: vi.fn() },
}));

vi.mock('@features/platform/plans/services/service', () => ({
  plansService: { list: vi.fn() },
}));

const meta = {
  page: 1,
  limit: 10,
  total: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe('usePlatformSubscriptionReferenceOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega tenants e planos ativos', async () => {
    vi.mocked(clientsService.list).mockResolvedValue({
      data: [
        {
          id: 'client-1',
          legalName: 'Escola Exemplo Ltda',
          tradeName: 'Escola Exemplo',
          documentNumber: '123',
          documentType: 'CNPJ',
          email: 'contato@exemplo.com',
          phone: '11999999999',
          status: 'active',
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ],
      meta,
    });
    vi.mocked(plansService.list).mockResolvedValue({
      data: [
        {
          id: 'plan-1',
          name: 'Premium',
          isActive: true,
          price: '199.90',
          currency: 'BRL',
          billingCycle: 'monthly',
          trialDays: 7,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
        {
          id: 'plan-2',
          name: 'Legado',
          isActive: false,
          price: '99.90',
          currency: 'BRL',
          billingCycle: 'monthly',
          trialDays: 0,
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
      ],
      meta,
    });

    const { result } = renderHook(() => usePlatformSubscriptionReferenceOptions());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.tenantOptions).toEqual([{ value: 'client-1', label: 'Escola Exemplo' }]);
    expect(result.current.planOptions).toEqual([{ value: 'plan-1', label: 'Premium' }]);
  });
});
