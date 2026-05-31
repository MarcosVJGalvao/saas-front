import { describe, expect, it } from 'vitest';
import {
  FRONT_SEND_NOTIFICATION_EVENT_KEY,
  createSendNotificationInitialValues,
  toNotificationMenuItems,
  toSendNotificationPayload,
} from '@features/client/notifications/normalizers/notification.normalizer';
import {
  MESSAGE_MAX_LENGTH,
  sendNotificationFormSchema,
} from '@features/client/notifications/schemas/sendNotificationForm.schema';

describe('notification normalizer', () => {
  it('cria valores iniciais do formulário', () => {
    expect(createSendNotificationInitialValues()).toEqual({
      message: '',
      targetUserIds: [],
    });
  });

  it('normaliza payload com eventKey fixo do front removendo ids vazios', () => {
    const values = sendNotificationFormSchema.parse({
      message: ' Fatura em atraso. ',
      targetUserIds: [' user-1 ', ' ', 'user-2'],
    });

    expect(toSendNotificationPayload(values)).toEqual({
      eventKey: FRONT_SEND_NOTIFICATION_EVENT_KEY,
      message: 'Fatura em atraso.',
      targetUserIds: ['user-1', 'user-2'],
    });
  });

  it('omite targetUserIds quando nenhum id válido é informado', () => {
    const values = sendNotificationFormSchema.parse({
      message: 'Fatura em atraso.',
      targetUserIds: [' ', '  '],
    });

    expect(toSendNotificationPayload(values)).toEqual({
      eventKey: FRONT_SEND_NOTIFICATION_EVENT_KEY,
      message: 'Fatura em atraso.',
    });
  });

  it('rejeita mensagem acima do limite do backend', () => {
    const result = sendNotificationFormSchema.safeParse({
      message: 'a'.repeat(MESSAGE_MAX_LENGTH + 1),
      targetUserIds: [],
    });

    expect(result.success).toBe(false);
  });

  it('gera itens do menu preservando estado de leitura', () => {
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
