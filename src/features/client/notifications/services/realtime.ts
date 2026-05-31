import {
  notificationItemSchema,
  type NotificationItem,
} from '@features/client/notifications/types/notification';

type NotificationListener = (notification: NotificationItem) => void;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readEnvironmentValue = (
  environment: Record<string, unknown>,
  key: string,
): string | undefined => {
  const value = environment[key];
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const normalizeWebsocketUrl = (baseUrl: string): string => {
  if (baseUrl.startsWith('ws://') || baseUrl.startsWith('wss://')) {
    return baseUrl;
  }

  if (baseUrl.startsWith('https://')) {
    return `wss://${baseUrl.slice('https://'.length)}`;
  }

  if (baseUrl.startsWith('http://')) {
    return `ws://${baseUrl.slice('http://'.length)}`;
  }

  return baseUrl;
};

const getNotificationsWebsocketUrl = (): string => {
  const environmentValue: unknown = Reflect.get(import.meta, 'env');
  if (!isRecord(environmentValue)) {
    return '';
  }

  const explicitWebsocketUrl =
    readEnvironmentValue(environmentValue, 'VITE_NOTIFICATIONS_WS_URL') ??
    readEnvironmentValue(environmentValue, 'NOTIFICATIONS_WS_URL');

  if (explicitWebsocketUrl !== undefined) {
    return normalizeWebsocketUrl(explicitWebsocketUrl);
  }

  const apiUrl =
    readEnvironmentValue(environmentValue, 'API_URL') ??
    readEnvironmentValue(environmentValue, 'VITE_API_URL');

  if (apiUrl === undefined) {
    return '';
  }

  return normalizeWebsocketUrl(apiUrl);
};

const extractNotificationCandidate = (payload: unknown): unknown => {
  if (!isRecord(payload)) {
    return payload;
  }

  const nestedData = payload.data;
  if (nestedData !== undefined) {
    return nestedData;
  }

  const nestedPayload = payload.payload;
  if (nestedPayload !== undefined) {
    return nestedPayload;
  }

  return payload;
};

class NotificationsRealtime {
  private listeners = new Set<NotificationListener>();

  private socket: WebSocket | null = null;

  private accessToken: string | null = null;

  private isConnecting = false;

  connect(accessToken?: string): void {
    const notificationsWebsocketUrl = getNotificationsWebsocketUrl();

    if (typeof window === 'undefined') {
      return;
    }
    if (notificationsWebsocketUrl.length === 0) {
      return;
    }
    if (this.socket !== null || this.isConnecting) {
      return;
    }

    this.accessToken = accessToken ?? null;
    this.isConnecting = true;

    const socket = new window.WebSocket(this.buildWebsocketUrl(notificationsWebsocketUrl));

    socket.addEventListener('open', () => {
      this.isConnecting = false;
    });

    socket.addEventListener('message', (event) => {
      const parsedNotification = this.parseMessage(event.data);
      if (parsedNotification === null) {
        return;
      }
      this.listeners.forEach((listener) => listener(parsedNotification));
    });

    socket.addEventListener('close', () => {
      this.socket = null;
      this.isConnecting = false;
    });

    socket.addEventListener('error', () => {
      this.isConnecting = false;
    });

    this.socket = socket;
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.isConnecting = false;
  }

  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private buildWebsocketUrl(baseUrl: string): string {
    if (this.accessToken === null || this.accessToken.length === 0) {
      return baseUrl;
    }

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}token=${encodeURIComponent(this.accessToken)}`;
  }

  private parseMessage(rawMessage: unknown): NotificationItem | null {
    if (typeof rawMessage !== 'string') {
      return null;
    }

    try {
      const parsedValue: unknown = JSON.parse(rawMessage);
      const candidate = extractNotificationCandidate(parsedValue);
      return notificationItemSchema.parse(candidate);
    } catch {
      return null;
    }
  }
}

export const notificationsRealtime = new NotificationsRealtime();
