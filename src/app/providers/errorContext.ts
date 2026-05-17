import { createContext } from 'react';
import type { AppError } from '@shared/types/appError';

export interface ErrorContextValue {
  pushError: (error: AppError) => void;
}

export const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);
