import { afterEach, describe, expect, it, vi } from 'vitest';
import { notificationService } from '@features/client/notifications/services/service';
import { httpClient } from '@shared/services/httpClient';

describe('notificationService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('lista notificações com paginação', async () => {
    const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
      data: {
        data: [
          {
            id: 'notification-1',
            message: 'Nova atualização disponível',
            read: false,
          },
        ],
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

    const response = await notificationService.list({ page: 1, limit: 10 });

    expect(getSpy).toHaveBeenCalledWith('/api/notifications', {
      params: { page: 1, limit: 10 },
    });
    expect(response.data[0]?.id).toBe('notification-1');
    expect(response.data[0]?.read).toBe(false);
  });

  it('marca notificação como lida no endpoint correto', async () => {
    const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValueOnce({
      data: {
        id: 'notification-1',
        message: 'Nova atualização disponível',
        read: true,
      },
    });

    const response = await notificationService.markAsRead('notification-1');

    expect(patchSpy).toHaveBeenCalledWith('/api/notifications/notification-1/read');
    expect(response.read).toBe(true);
  });

  it('envia notificação in-app omitindo targetUserIds vazios', async () => {
    const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
      data: {
        status: 'SENT',
        deliveredCount: 1,
      },
    });

    const response = await notificationService.sendInApp({
      eventKey: 'invoice.overdue',
      message: 'Fatura em atraso.',
      targetUserIds: [],
    });

    expect(postSpy).toHaveBeenCalledWith('/api/notifications/in-app/send', {
      eventKey: 'invoice.overdue',
      message: 'Fatura em atraso.',
    });
    expect(response.deliveredCount).toBe(1);
  });
});
