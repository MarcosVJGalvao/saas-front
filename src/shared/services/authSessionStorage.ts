import type { AuthSession } from '@shared/types/authSession';

const CLIENT_AUTH_SESSION_KEY = 'client_auth_session';
const PLATFORM_AUTH_SESSION_KEY = 'platform_auth_session';

const isBrowser = () => typeof window !== 'undefined';
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readSessionByKey = (storage: Storage, key: string): AuthSession | null => {
  const rawValue = storage.getItem(key);
  if (rawValue === null) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    if (isRecord(parsedValue) && 'accessToken' in parsedValue && 'refreshToken' in parsedValue) {
      const accessToken = parsedValue.accessToken;
      const refreshToken = parsedValue.refreshToken;
      const rawExpiresIn = parsedValue.expiresIn;
      const rawSessionId = parsedValue.sessionId;
      const expiresIn =
        typeof rawExpiresIn === 'string'
          ? rawExpiresIn
          : typeof rawExpiresIn === 'number'
            ? `${rawExpiresIn}s`
            : '1h';
      const sessionId = typeof rawSessionId === 'string' ? rawSessionId : 'unknown-session';
      if (typeof accessToken === 'string' && typeof refreshToken === 'string') {
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

export const hasPlatformPersistentSession = (): boolean => {
  if (!isBrowser()) {
    return false;
  }
  return readSessionByKey(window.localStorage, PLATFORM_AUTH_SESSION_KEY) !== null;
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
