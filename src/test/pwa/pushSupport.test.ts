import {
  isPushSupported,
  requestNotificationPermission,
  subscribeToPush,
} from '@app/pwa/push/pushSupport';

describe('pushSupport', () => {
  it('retorna unsupported quando notificações não estão disponíveis', async () => {
    vi.stubGlobal('Notification', undefined);

    expect(isPushSupported()).toBe(false);
    await expect(requestNotificationPermission()).resolves.toBe('unsupported');
    await expect(subscribeToPush({ vapidPublicKey: 'key' })).resolves.toEqual({
      success: false,
      reason: 'unsupported',
    });
  });
});
