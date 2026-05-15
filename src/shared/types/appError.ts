export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type ErrorDisplayMode = 'SNACKBAR' | 'MODAL';

export const ErrorSeverity: Record<ErrorSeverity, ErrorSeverity> = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const ErrorDisplayMode: Record<ErrorDisplayMode, ErrorDisplayMode> = {
  SNACKBAR: 'SNACKBAR',
  MODAL: 'MODAL',
};

export interface AppError {
  message: string;
  messages?: string[] | undefined;
  code?: string | undefined;
  correlationId?: string | undefined;
  status?: number | undefined;
  severity: ErrorSeverity;
  displayMode: ErrorDisplayMode;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
