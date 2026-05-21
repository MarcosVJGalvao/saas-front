import type {
  PwaPushBridge,
  PushSubscriptionRequest,
  PushSubscriptionResult,
} from '@app/pwa/push/push.types';
import type { PwaPushPermissionState } from '@app/pwa/types';

const isBrowser = () => typeof window !== 'undefined';

const getNotificationPermission = (): PwaPushPermissionState => {
  if (!isBrowser()) {
    return 'unsupported';
  }

  const notificationConstructor: unknown = Reflect.get(window, 'Notification');
  if (typeof notificationConstructor !== 'function') {
    return 'unsupported';
  }

  const notificationPermission: unknown = Reflect.get(notificationConstructor, 'permission');
  return notificationPermission === 'granted' ||
    notificationPermission === 'denied' ||
    notificationPermission === 'default'
    ? notificationPermission
    : 'unsupported';
};

export const isPushSupported = (): boolean =>
  isBrowser() &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  typeof Reflect.get(window, 'Notification') === 'function';

export const requestNotificationPermission = async (): Promise<PwaPushPermissionState> => {
  if (!isPushSupported()) {
    return 'unsupported';
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted' || permission === 'denied' || permission === 'default'
    ? permission
    : 'unsupported';
};

const createResult = (reason: PushSubscriptionResult['reason']): PushSubscriptionResult => ({
  success: false,
  reason,
});

export const subscribeToPush = (
  _request: PushSubscriptionRequest,
): Promise<PushSubscriptionResult> => {
  const permissionState = getNotificationPermission();

  if (!isPushSupported()) {
    return Promise.resolve(createResult('unsupported'));
  }

  if (permissionState !== 'granted') {
    return Promise.resolve(createResult('permission_denied'));
  }

  return Promise.resolve(createResult('not_implemented'));
};

export const unsubscribeFromPush = (): Promise<boolean> => Promise.resolve(false);

export const pwaPushBridge: PwaPushBridge = {
  isPushSupported: isPushSupported(),
  permissionState: getNotificationPermission(),
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
};
