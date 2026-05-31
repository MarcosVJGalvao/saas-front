import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotificationCenter } from '@features/client/notifications/hooks/useNotificationCenter';

const listMock = vi.fn();
const markAsReadMock = vi.fn();
const subscribeMock = vi.fn();
const unsubscribeMock = vi.fn();

vi.mock('@features/client/notifications/services/service', () => ({
  notificationService: {
    list: (...args: unknown[]) => listMock(...args),
    markAsRead: (...args: unknown[]) => markAsReadMock(...args),
  },
}));

vi.mock('@features/client/notifications/services/realtime', () => ({
  notificationsRealtime: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    subscribe: (listener: (notification: unknown) => void) => {
      subscribeMock(listener);
      return unsubscribeMock;
    },
  },
}));

vi.mock('@shared/hooks/useAuth/useAuth', () => ({
  useAuth: () => ({
    authDomain: 'client',
    session: {
      accessToken: 'token-123',
    },
  }),
}));

describe('useNotificationCenter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deriva unreadCount a partir das notificações carregadas', async () => {
    listMock.mockResolvedValueOnce({
      data: [
        { id: '1', message: 'Primeira', read: false },
        { id: '2', message: 'Segunda', read: true },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const { result } = renderHook(() => useNotificationCenter());

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(1);
    });

    expect(result.current.notifications).toHaveLength(2);
  });

  it('marca notificação como lida e atualiza a coleção local', async () => {
    listMock.mockResolvedValueOnce({
      data: [{ id: '1', message: 'Primeira', read: false }],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
    markAsReadMock.mockResolvedValueOnce({ id: '1', message: 'Primeira', read: true });

    const { result } = renderHook(() => useNotificationCenter());

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(1);
    });

    await act(async () => {
      await result.current.markAsRead('1');
    });

    expect(result.current.unreadCount).toBe(0);
    expect(result.current.notifications[0]?.read).toBe(true);
  });

  it('processa notification.created em tempo real sem duplicar ids', async () => {
    listMock.mockResolvedValueOnce({
      data: [{ id: '1', message: 'Primeira', read: false }],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });

    const { result } = renderHook(() => useNotificationCenter());

    await waitFor(() => {
      expect(subscribeMock).toHaveBeenCalledTimes(1);
    });

    const listenerCandidate = subscribeMock.mock.calls[0]?.[0];
    if (typeof listenerCandidate !== 'function') {
      throw new Error('Era esperado um listener de notificações.');
    }

    act(() => {
      listenerCandidate({
        eventKey: 'invoice.overdue',
        message: 'Segunda',
        notifications: [{ id: '2', message: 'Segunda', read: false }],
      });
      listenerCandidate({
        eventKey: 'invoice.overdue',
        message: 'Segunda',
        notifications: [{ id: '2', message: 'Segunda', read: false }],
      });
    });

    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[0]?.id).toBe('2');
    expect(result.current.snackbarMessage).toBe('Segunda');
  });
});
