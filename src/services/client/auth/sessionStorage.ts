import type { AuthSession } from './types';

const CLIENT_AUTH_SESSION_KEY = 'client_auth_session';
const PLATFORM_AUTH_SESSION_KEY = 'platform_auth_session';

const isBrowser = () => typeof window !== 'undefined';

export const readClientSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }
  const rawValue = window.sessionStorage.getItem(CLIENT_AUTH_SESSION_KEY);
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
        return {
          accessToken,
          refreshToken,
          expiresIn,
          sessionId,
        };
      }
    }
    return null;
  } catch {
    window.sessionStorage.removeItem(CLIENT_AUTH_SESSION_KEY);
    return null;
  }
};

export const writeClientSession = (session: AuthSession): void => {
  if (!isBrowser()) {
    return;
  }
  window.sessionStorage.setItem(CLIENT_AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearClientSessionStorage = (): void => {
  if (!isBrowser()) {
    return;
  }
  window.sessionStorage.removeItem(CLIENT_AUTH_SESSION_KEY);
};

export const readPlatformSession = (): AuthSession | null => {
  if (!isBrowser()) {
    return null;
  }
  const rawValue = window.sessionStorage.getItem(PLATFORM_AUTH_SESSION_KEY);
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
    window.sessionStorage.removeItem(PLATFORM_AUTH_SESSION_KEY);
    return null;
  }
};

export const writePlatformSession = (session: AuthSession): void => {
  if (!isBrowser()) {
    return;
  }
  window.sessionStorage.setItem(PLATFORM_AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearPlatformSessionStorage = (): void => {
  if (!isBrowser()) {
    return;
  }
  window.sessionStorage.removeItem(PLATFORM_AUTH_SESSION_KEY);
};
