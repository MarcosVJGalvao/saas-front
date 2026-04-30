import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { ErrorHandler } from '../errors/ErrorHandler';
import type { AppError } from '../models/types';
import {
  clearClientSessionStorage,
  readClientSession,
  writeClientSession,
} from './client/auth/sessionStorage';
import type { AuthSession } from './client/auth/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLIENT_REFRESH_PATH = '/api/client/auth/refresh';
const CLIENT_LOGIN_PATH = '/api/client/login';

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

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

let refreshPromise: Promise<AuthSession> | null = null;

const refreshClientSession = async (): Promise<AuthSession> => {
  const currentSession = readClientSession();
  if (currentSession === null) {
    throw new Error('Sessao ausente para refresh.');
  }
  const response = await httpClient.post<AuthSession>(CLIENT_REFRESH_PATH, {
    refreshToken: currentSession.refreshToken,
  });
  writeClientSession(response.data);
  return response.data;
};

httpClient.interceptors.request.use((config) => {
  const session = readClientSession();
  if (session?.accessToken !== undefined) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{ errorCode?: string; message?: string | string[]; correlationId?: string }>,
  ) => {
    const originalRequest = toRetriableRequestConfig(error.config);
    const status = error.response?.status;
    const isRefreshCall = originalRequest?.url?.includes(CLIENT_REFRESH_PATH) ?? false;

    if (
      status === 401 &&
      originalRequest !== undefined &&
      !originalRequest._retry &&
      !isRefreshCall
    ) {
      originalRequest._retry = true;
      const currentRefreshPromise = refreshPromise ?? refreshClientSession();
      refreshPromise = currentRefreshPromise;
      return currentRefreshPromise
        .then((session) => {
          refreshPromise = null;
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
          return httpClient.request(originalRequest);
        })
        .catch((refreshError) => {
          refreshPromise = null;
          clearClientSessionStorage();
          if (typeof window !== 'undefined') {
            window.location.replace(CLIENT_LOGIN_PATH);
          }
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
