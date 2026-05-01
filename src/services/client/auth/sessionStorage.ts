import type { AuthSession } from './types';

const CLIENT_AUTH_SESSION_KEY = 'client_auth_session';
const PLATFORM_AUTH_SESSION_KEY = 'platform_auth_session';

const isBrowser = () => typeof window !== 'undefined';

const readSessionByKey = (storage: Storage, key: string): AuthSession | null => {
  const rawValue = storage.getItem(key);
  if (rawValue === null) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    if (
      typeof parsedValue === 'object' &&
      parsedValue !== null &&
      'accessToken' in parsedValue &&
      'refreshToken' in parsedValue &&
      'expiresIn' in parsedValue &&
      'sessionId' in parsedValue
    ) {
      const accessToken = Reflect.get(parsedValue, 'accessToken');
      const refreshToken = Reflect.get(parsedValue, 'refreshToken');
      const expiresIn = Reflect.get(parsedValue, 'expiresIn');
      const sessionId = Reflect.get(parsedValue, 'sessionId');
      if (
        typeof accessToken === 'string' &&
        typeof refreshToken === 'string' &&
        typeof expiresIn === 'string' &&
        typeof sessionId === 'string'
      ) {
        return { accessToken, refreshToken, expiresIn, sessionId };
      }
    }
    return null;
  } catch {
    storage.removeItem(key);
    return null;
  }
};

const writeSessionByKey = (key: string, session: AuthSession, persistent: boolean): void => {
  if (!isBrowser()) {
    return;
  }

  const serialized = JSON.stringify(session);
  if (persistent) {
    window.localStorage.setItem(key, serialized);
    window.sessionStorage.removeItem(key);
    return;
  }

  window.sessionStorage.setItem(key, serialized);
  window.localStorage.removeItem(key);
};

const clearSessionByKey = (key: string): void => {
  if (!isBrowser()) {
    return;
  }
  window.sessionStorage.removeItem(key);
  window.localStorage.removeItem(key);
};

export const hasClientPersistentSession = (): boolean => {
  if (!isBrowser()) {
    return false;
  }
  return readSessionByKey(window.localStorage, CLIENT_AUTH_SESSION_KEY) !== null;
};

export const readClientSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }
  return (
    readSessionByKey(window.sessionStorage, CLIENT_AUTH_SESSION_KEY) ??
    readSessionByKey(window.localStorage, CLIENT_AUTH_SESSION_KEY)
  );
};

export const writeClientSession = (session: AuthSession, persistent = false): void => {
  writeSessionByKey(CLIENT_AUTH_SESSION_KEY, session, persistent);
};

export const clearClientSessionStorage = (): void => {
  clearSessionByKey(CLIENT_AUTH_SESSION_KEY);
};

export const readPlatformSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }
  return (
    readSessionByKey(window.sessionStorage, PLATFORM_AUTH_SESSION_KEY) ??
    readSessionByKey(window.localStorage, PLATFORM_AUTH_SESSION_KEY)
  );
};

export const writePlatformSession = (session: AuthSession, persistent = false): void => {
  writeSessionByKey(PLATFORM_AUTH_SESSION_KEY, session, persistent);
};

export const clearPlatformSessionStorage = (): void => {
  clearSessionByKey(PLATFORM_AUTH_SESSION_KEY);
};
