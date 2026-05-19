import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import type { AppError } from '@shared/types/appError';
import {
  clearClientSessionStorage,
  clearPlatformSessionStorage,
  hasClientPersistentSession,
  hasPlatformPersistentSession,
  readClientSession,
  readPlatformSession,
  writeClientSession,
  writePlatformSession,
} from '@shared/services/authSessionStorage';
import type { AuthSession } from '@shared/types/authSession';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLIENT_REFRESH_PATH = '/api/auth/refresh';
const PLATFORM_REFRESH_PATH = '/api/platform/auth/refresh';
const CLIENT_API_BASE_PATH = '/api/client';
const PLATFORM_API_BASE_PATH = '/api/platform';
const AUTH_REQUEST_PATHS: ReadonlyArray<string> = [
  '/api/auth/login',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/change-password',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/platform/auth/login',
  '/api/platform/auth/refresh',
  '/api/platform/auth/me',
  '/api/platform/auth/verify-totp',
  '/api/platform/auth/verify-setup',
  '/api/platform/auth/setup-from-challenge',
  '/api/platform/auth/totp/reset-by-login',
  '/api/platform/auth/change-password',
  '/api/platform/auth/logout',
];
const UNAUTHORIZED_ERROR_CODE = 'UNAUTHORIZED';
const TOKEN_EXPIRED_ERROR_CODE = 'TOKEN_EXPIRED';
const REFRESH_TOKEN_INVALID_ERROR_CODE = 'REFRESH_TOKEN_INVALID';
const TOKEN_EXPIRED_EVENT = 'app:token-expired';
const SESSION_UPDATED_EVENT = 'app:session-updated';
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getLoginPathByCurrentLocation = (): string => {
  if (typeof window === 'undefined') {
    return '/platform/login';
  }
  return window.location.pathname.startsWith('/client') ? '/client/login' : '/platform/login';
};

const redirectToCurrentDomainLogin = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  const loginPath = getLoginPathByCurrentLocation();
  if (window.location.pathname !== loginPath) {
    window.location.assign(loginPath);
  }
};

interface RetriableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const toRetriableRequestConfig = (
  config: AxiosRequestConfig | undefined,
): RetriableRequestConfig | undefined => {
  if (config === undefined) {
    return undefined;
  }
  return config;
};

export const shouldSkipTokenRefreshForRequest = (requestUrl: string): boolean =>
  AUTH_REQUEST_PATHS.some((path) => requestUrl.includes(path)) ||
  requestUrl.includes(CLIENT_REFRESH_PATH) ||
  requestUrl.includes(PLATFORM_REFRESH_PATH);

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

let refreshPromise: Promise<AuthSession> | null = null;
const REFRESH_THRESHOLD_SECONDS = 5 * 60;

const refreshClientSession = async (): Promise<AuthSession> => {
  const currentSession = readClientSession();
  if (currentSession === null) {
    throw new Error('Sessão ausente para refresh.');
  }
  const response = await httpClient.post<AuthSession>(CLIENT_REFRESH_PATH, {
    refreshToken: currentSession.refreshToken,
  });
  writeClientSession(response.data);
  return response.data;
};

const refreshPlatformSession = async (): Promise<AuthSession> => {
  const currentSession = readPlatformSession();
  if (currentSession === null) {
    throw new Error('Sessão de plataforma ausente para refresh.');
  }
  const response = await httpClient.post<AuthSession>(PLATFORM_REFRESH_PATH, {
    refreshToken: currentSession.refreshToken,
  });
  writePlatformSession(response.data, hasPlatformPersistentSession());
  return response.data;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) return null;
  const payloadPart = tokenParts[1];
  if (payloadPart === undefined) return null;
  const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
  try {
    const decoded = window.atob(paddedPayload);
    const parsed: unknown = JSON.parse(decoded);
    if (isRecord(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
};

const getRemainingTokenLifetime = (accessToken: string): number | null => {
  const payload = decodeJwtPayload(accessToken);
  if (payload === null) return null;
  const exp = payload.exp;
  if (typeof exp !== 'number') return null;
  return Math.max(Math.floor(exp - Date.now() / 1000), 0);
};

const shouldRefreshToken = (session: AuthSession | null): boolean => {
  if (session === null) return false;
  const remainingSeconds = getRemainingTokenLifetime(session.accessToken);
  return remainingSeconds !== null && remainingSeconds <= REFRESH_THRESHOLD_SECONDS;
};

const dispatchSessionUpdatedEvent = (): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SESSION_UPDATED_EVENT));
  }
};

httpClient.interceptors.request.use((config) => {
  const requestUrl = config.url ?? '';
  const isClientRequest = requestUrl.includes(CLIENT_API_BASE_PATH);
  const isPlatformRequest = requestUrl.includes(PLATFORM_API_BASE_PATH);
  const shouldSkipRefresh = shouldSkipTokenRefreshForRequest(requestUrl);

  const session = isPlatformRequest
    ? readPlatformSession()
    : isClientRequest
      ? readClientSession()
      : (readClientSession() ?? readPlatformSession());

  if (session?.accessToken !== undefined) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  if (shouldSkipRefresh || !shouldRefreshToken(session)) {
    return config;
  }

  const runRefresh = isPlatformRequest ? refreshPlatformSession : refreshClientSession;
  const currentRefreshPromise = refreshPromise ?? runRefresh();
  refreshPromise = currentRefreshPromise;

  return currentRefreshPromise
    .then((nextSession) => {
      refreshPromise = null;
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${nextSession.accessToken}`;
      if (isClientRequest) {
        writeClientSession(nextSession, hasClientPersistentSession());
      } else if (isPlatformRequest) {
        writePlatformSession(nextSession, hasPlatformPersistentSession());
      }
      dispatchSessionUpdatedEvent();
      return config;
    })
    .catch((refreshError) => {
      refreshPromise = null;
      return Promise.reject(
        refreshError instanceof Error ? refreshError : new Error('Falha ao atualizar sessão.'),
      );
    });
});

httpClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{ errorCode?: string; message?: string | string[]; correlationId?: string }>,
  ) => {
    const originalRequest = toRetriableRequestConfig(error.config);
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? '';
    const isRefreshCall = requestUrl.includes(CLIENT_REFRESH_PATH);
    const isAuthRequest = AUTH_REQUEST_PATHS.some((path) => requestUrl.includes(path));
    const isClientApiRequest = requestUrl.includes(CLIENT_API_BASE_PATH);
    const errorCode = error.response?.data?.errorCode;

    if (errorCode === UNAUTHORIZED_ERROR_CODE) {
      clearClientSessionStorage();
      clearPlatformSessionStorage();
      redirectToCurrentDomainLogin();
    }

    if (errorCode === REFRESH_TOKEN_INVALID_ERROR_CODE) {
      clearClientSessionStorage();
      clearPlatformSessionStorage();
      redirectToCurrentDomainLogin();
    }

    if (errorCode === TOKEN_EXPIRED_ERROR_CODE && typeof window !== 'undefined') {
      clearClientSessionStorage();
      clearPlatformSessionStorage();
      window.dispatchEvent(new CustomEvent(TOKEN_EXPIRED_EVENT));
    }

    if (
      status === 401 &&
      originalRequest !== undefined &&
      !originalRequest._retry &&
      !isRefreshCall &&
      isClientApiRequest &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      const currentRefreshPromise = refreshPromise ?? refreshClientSession();
      refreshPromise = currentRefreshPromise;
      return currentRefreshPromise
        .then((session) => {
          refreshPromise = null;
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
          dispatchSessionUpdatedEvent();
          return httpClient.request(originalRequest);
        })
        .catch((refreshError) => {
          refreshPromise = null;
          clearClientSessionStorage();
          return Promise.reject(
            refreshError instanceof Error ? refreshError : new Error('Falha ao atualizar sessao.'),
          );
        });
    }

    const normalizedError: AppError = ErrorHandler.fromHttp(status, error.response?.data);
    if (normalizedError.message.length === 0) {
      normalizedError.message = error.message;
    }
    return Promise.reject(new Error(normalizedError.message, { cause: normalizedError }));
  },
);
