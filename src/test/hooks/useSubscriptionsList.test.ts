import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useSubscriptionsList } from '../../hooks/subscriptions/useSubscriptionsList';
import { subscriptionsService } from '../../services/platform/subscriptions/service';

vi.mock('../../services/platform/subscriptions/service', () => ({
  subscriptionsService: {
    list: vi.fn(),
  },
}));

describe('useSubscriptionsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data and resolves pagination meta', async () => {
    vi.mocked(subscriptionsService.list).mockResolvedValue({
      data: [
        {
          id: 'sub-1',
          tenantId: 'tenant-1',
          planId: 'plan-1',
          status: 'active',
          startDate: '2026-05-01',
          cancelsAtPeriodEnd: false,
          priceAtSubscription: '20',
          createdAt: '2026-05-01',
          updatedAt: '2026-05-01',
        },
      ],
      meta: {
        page: 2,
        limit: 25,
        total: 40,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });

    const { result } = renderHook(() => useSubscriptionsList({ page: 2, limit: 25 }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(subscriptionsService.list).toHaveBeenCalledWith({ page: 2, limit: 25 });
    expect(result.current.rows).toHaveLength(1);
    expect(result.current.meta.page).toBe(2);
    expect(result.current.meta.limit).toBe(25);
    expect(result.current.meta.total).toBe(40);
  });

  it('updates query and resets page when filter changes', async () => {
    vi.mocked(subscriptionsService.list).mockResolvedValue({
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const { result } = renderHook(() => useSubscriptionsList());

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.updateQuery({ status: 'trialing', page: 1 });
    });

    await waitFor(() => {
      expect(subscriptionsService.list).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: 'trialing', page: 1 }),
      );
    });
  });

  it('exposes error message when request fails', async () => {
    vi.mocked(subscriptionsService.list).mockRejectedValue(new Error('erro-api'));

    const { result } = renderHook(() => useSubscriptionsList());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.errorMessage).toBe('erro-api');
  });
});
