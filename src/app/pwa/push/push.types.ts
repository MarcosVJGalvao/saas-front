import type { PwaPushPermissionState } from '@app/pwa/types';

export interface PushSubscriptionRequest {
  vapidPublicKey: string;
}

export interface PushSubscriptionResult {
  success: boolean;
  reason?: 'unsupported' | 'permission_denied' | 'not_implemented' | undefined;
  subscriptionJson?: string | undefined;
}

export interface PwaPushBridge {
  isPushSupported: boolean;
  permissionState: PwaPushPermissionState;
  requestNotificationPermission: () => Promise<PwaPushPermissionState>;
  subscribeToPush: (request: PushSubscriptionRequest) => Promise<PushSubscriptionResult>;
  unsubscribeFromPush: () => Promise<boolean>;
}
