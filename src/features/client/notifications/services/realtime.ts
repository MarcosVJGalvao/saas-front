import { io, type Socket } from 'socket.io-client';
import {
  notificationCreatedEventSchema,
  type NotificationCreatedEvent,
} from '@features/client/notifications/types/notification';

type NotificationListener = (event: NotificationCreatedEvent) => void;

const NOTIFICATION_CREATED_EVENT = 'notification.created';
const NOTIFICATIONS_NAMESPACE = '/notifications';

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

const normalizeSocketBaseUrl = (baseUrl: string): string => {
  let normalizedProtocol = baseUrl;

  if (baseUrl.startsWith('wss://')) {
    normalizedProtocol = `https://${baseUrl.slice('wss://'.length)}`;
  } else if (baseUrl.startsWith('ws://')) {
    normalizedProtocol = `http://${baseUrl.slice('ws://'.length)}`;
  }

  return normalizedProtocol.replace(/\/+$/, '');
};

const buildNotificationsSocketUrl = (baseUrl: string): string => {
  const normalizedBaseUrl = normalizeSocketBaseUrl(baseUrl);
  return normalizedBaseUrl.endsWith(NOTIFICATIONS_NAMESPACE)
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}${NOTIFICATIONS_NAMESPACE}`;
};

const getNotificationsSocketUrl = (): string => {
  const environmentValue: unknown = Reflect.get(import.meta, 'env');
  if (!isRecord(environmentValue)) {
    return '';
  }

  const explicitSocketUrl =
    readEnvironmentValue(environmentValue, 'VITE_NOTIFICATIONS_WS_URL') ??
    readEnvironmentValue(environmentValue, 'NOTIFICATIONS_WS_URL');

  if (explicitSocketUrl !== undefined) {
    return buildNotificationsSocketUrl(explicitSocketUrl);
  }

  const apiUrl =
    readEnvironmentValue(environmentValue, 'API_URL') ??
    readEnvironmentValue(environmentValue, 'VITE_API_URL');

  if (apiUrl === undefined) {
    return '';
  }

  return buildNotificationsSocketUrl(apiUrl);
};

class NotificationsRealtime {
  private listeners = new Set<NotificationListener>();

  private socket: Socket | null = null;

  connect(accessToken?: string): void {
    const notificationsSocketUrl = getNotificationsSocketUrl();

    if (typeof window === 'undefined') {
      return;
    }
    if (notificationsSocketUrl.length === 0) {
      return;
    }
    if (this.socket !== null) {
      return;
    }

    const socketOptions =
      accessToken === undefined || accessToken.length === 0
        ? { transports: ['websocket'] }
        : { transports: ['websocket'], auth: { token: accessToken } };

    const socket = io(notificationsSocketUrl, socketOptions);

    socket.on(NOTIFICATION_CREATED_EVENT, (payload: unknown) => {
      try {
        const parsedEvent = notificationCreatedEventSchema.parse(payload);
        this.listeners.forEach((listener) => listener(parsedEvent));
      } catch {
        return;
      }
    });

    socket.on('disconnect', () => {
      this.socket = null;
    });

    this.socket = socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const notificationsRealtime = new NotificationsRealtime();
