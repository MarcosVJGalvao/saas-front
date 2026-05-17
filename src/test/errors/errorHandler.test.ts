import { describe, expect, it } from 'vitest';
import { ErrorHandler } from '@shared/errors/ErrorHandler';
import { ErrorDisplayMode, ErrorSeverity } from '@shared/types/appError';

describe('ErrorHandler', () => {
  it('translates INVALID_INPUT messages and keeps all entries', () => {
    const result = ErrorHandler.fromHttp(400, {
      errorCode: 'INVALID_INPUT',
      message: ['field cannot be empty', 'email is invalid'],
      correlationId: 'c113416d-2180-4141-9965-c14f93046977',
    });

    expect(result.message).toBe('Existem campos inválidos. Revise os dados informados.');
    expect(result.messages).toEqual(['O campo não pode estar vazio.', 'O e-mail é inválido.']);
    expect(result.correlationId).toBe('c113416d-2180-4141-9965-c14f93046977');
    expect(result.displayMode).toBe(ErrorDisplayMode.SNACKBAR);
    expect(result.severity).toBe(ErrorSeverity.MEDIUM);
  });

  it('uses fallback message when error code is not mapped', () => {
    const result = ErrorHandler.fromHttp(400, {
      errorCode: 'UNKNOWN_CODE',
      message: ['custom backend error'],
    });

    expect(result.message).toBe('custom backend error');
    expect(result.messages).toEqual(['custom backend error']);
  });
});
