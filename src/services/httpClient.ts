import axios from 'axios';
import type { AxiosError } from 'axios';
import { ErrorHandler } from '../errors/ErrorHandler';
import type { AppError } from '../models/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

httpClient.interceptors.response.use(
  (response) => response,
  (
    error: AxiosError<{ errorCode?: string; message?: string | string[]; correlationId?: string }>,
  ) => {
    const status = error.response?.status;
    const normalizedError: AppError = ErrorHandler.fromHttp(status, error.response?.data);
    if (normalizedError.message.length === 0) {
      normalizedError.message = error.message;
    }
    return Promise.reject(new Error(normalizedError.message, { cause: normalizedError }));
  },
);
