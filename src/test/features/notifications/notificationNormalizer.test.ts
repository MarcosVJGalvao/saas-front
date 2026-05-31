import { describe, expect, it } from 'vitest';
import {
  createSendNotificationInitialValues,
  toNotificationMenuItems,
  toSendNotificationPayload,
} from '@features/client/notifications/normalizers/notification.normalizer';
import { sendNotificationFormSchema } from '@features/client/notifications/schemas/sendNotificationForm.schema';

describe('notification normalizer', () => {
  it('cria valores iniciais do formulário', () => {
    expect(createSendNotificationInitialValues()).toEqual({
      eventKey: '',
      message: '',
      targetUserIds: '',
    });
  });

  it('normaliza payload removendo ids vazios', () => {
    const values = sendNotificationFormSchema.parse({
      eventKey: ' invoice.overdue ',
      message: ' Fatura em atraso. ',
      targetUserIds: ' user-1, , user-2 ,, ',
    });

    expect(toSendNotificationPayload(values)).toEqual({
      eventKey: 'invoice.overdue',
      message: 'Fatura em atraso.',
      targetUserIds: ['user-1', 'user-2'],
    });
  });

  it('omite targetUserIds quando nenhum id válido é informado', () => {
    const values = sendNotificationFormSchema.parse({
      eventKey: 'invoice.overdue',
      message: 'Fatura em atraso.',
      targetUserIds: ' ,  , ',
    });

    expect(toSendNotificationPayload(values)).toEqual({
      eventKey: 'invoice.overdue',
      message: 'Fatura em atraso.',
    });
  });

  it('gera itens do menu com limite e ordenação por mais recentes', () => {
    const items = toNotificationMenuItems([
      { id: '1', message: 'Primeira', read: true },
      { id: '2', message: 'Segunda', read: false },
      { id: '3', message: 'Terceira', read: false },
    ]);

    expect(items).toHaveLength(3);
    expect(items[0]?.id).toBe('1');
    expect(items[1]?.unread).toBe(true);
  });
});
