import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotificationsList } from '@features/client/notifications/hooks/useNotificationsList';

const listMock = vi.fn();

vi.mock('@features/client/notifications/services/service', () => ({
  notificationService: {
    list: (...args: unknown[]) => listMock(...args),
  },
}));

describe('useNotificationsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega notificações com paginação', async () => {
    listMock.mockResolvedValueOnce({
      data: [{ id: 'notification-1', message: 'Nova atualização disponível', read: false }],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const { result } = renderHook(() => useNotificationsList());

    await waitFor(() => {
      expect(result.current.rows).toHaveLength(1);
    });

    expect(result.current.pagination.total).toBe(1);
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('expõe mensagem amigável quando a listagem falha', async () => {
    listMock.mockRejectedValueOnce(new Error('Falha'));

    const { result } = renderHook(() => useNotificationsList());

    await waitFor(() => {
      expect(result.current.errorMessage).toBe('Não foi possível carregar as notificações.');
    });
  });

  it('atualiza query params e recarrega sob demanda', async () => {
    listMock.mockResolvedValue({
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

    const { result } = renderHook(() => useNotificationsList());

    await waitFor(() => {
      expect(listMock).toHaveBeenCalled();
    });

    act(() => {
      result.current.updateQueryParams({ page: 2 });
    });

    await waitFor(() => {
      expect(listMock).toHaveBeenLastCalledWith({ page: 2, limit: 10 });
    });
  });
});
