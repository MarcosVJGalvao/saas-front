import type { AppError } from '@shared/types/appError';
import { ErrorDisplayMode, ErrorSeverity } from '@shared/types/appError';
import {
  errorCodeMessages,
  errorMessageTranslations,
  GENERIC_ERROR_MESSAGE,
} from '@shared/i18n/pt-BR/errors';
import { connectivityMessages } from '@shared/i18n/pt-BR/messages';

interface ApiErrorPayload {
  errorCode?: string;
  message?: string | string[];
  correlationId?: string;
}

export class ErrorHandler {
  static normalize(error: unknown): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    if (error instanceof Error && this.isAppError(error.cause)) {
      return error.cause;
    }

    if (error instanceof Error) {
      const severity = ErrorSeverity.MEDIUM;
      const displayMode = ErrorDisplayMode.SNACKBAR;
      const message =
        error.message.length > 0 ? error.message : connectivityMessages.networkRequestFailed;
      return { message, severity, displayMode };
    }

    return {
      message: GENERIC_ERROR_MESSAGE,
      severity: ErrorSeverity.HIGH,
      displayMode: ErrorDisplayMode.MODAL,
    };
  }

  static fromHttp(status?: number, payload?: ApiErrorPayload): AppError {
    const translatedMessages = this.extractMessages(payload?.message);
    const code = payload?.errorCode;
    const correlationId = payload?.correlationId;
    const codeMessage = code !== undefined ? errorCodeMessages[code] : undefined;
    const fallbackMessage = translatedMessages[0];
    const message = codeMessage ?? fallbackMessage;

    if (status !== undefined && status >= 500) {
      return {
        message: message ?? GENERIC_ERROR_MESSAGE,
        messages: translatedMessages,
        code,
        correlationId,
        status,
        severity: ErrorSeverity.HIGH,
        displayMode: ErrorDisplayMode.MODAL,
      };
    }

    return {
      message: message ?? GENERIC_ERROR_MESSAGE,
      messages: translatedMessages,
      code,
      correlationId,
      status,
      severity: ErrorSeverity.MEDIUM,
      displayMode: ErrorDisplayMode.SNACKBAR,
    };
  }

  private static extractMessages(rawMessage?: string | string[]): string[] {
    const values = typeof rawMessage === 'string' ? [rawMessage] : (rawMessage ?? []);
    return values.map((item) => this.translateMessage(item));
  }

  private static translateMessage(message: string): string {
    const normalizedMessage = message.trim().toLowerCase();
    return errorMessageTranslations[normalizedMessage] ?? message;
  }

  private static isAppError(error: unknown): error is AppError {
    if (typeof error !== 'object' || error === null) {
      return false;
    }
    return (
      'message' in error &&
      typeof error.message === 'string' &&
      'severity' in error &&
      typeof error.severity === 'string' &&
      'displayMode' in error &&
      typeof error.displayMode === 'string'
    );
  }
}
