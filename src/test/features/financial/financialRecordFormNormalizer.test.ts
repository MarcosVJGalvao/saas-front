import { describe, expect, it } from 'vitest';
import {
  buildFinancialRecordInitialValues,
  normalizeFinancialRecordPayload,
} from '@features/client/financial/normalizers/financialRecordFormNormalizer';
import { financialRecordFormSchema } from '@features/client/financial/schemas/financialRecordFormSchema';

describe('financial record form normalizer', () => {
  it('cria estado inicial padrão', () => {
    expect(buildFinancialRecordInitialValues()).toEqual({
      description: '',
      amount: '',
      dueDate: '',
      status: 'open',
      categoryId: '',
      costCenterId: '',
      studentId: '',
    });
  });

  it('normaliza conta financeira com valor BRL', () => {
    const values = financialRecordFormSchema.parse({
      description: ' Mensalidade ',
      amount: 'R$ 1.250,90',
      dueDate: '2026-02-10',
      status: 'open',
      categoryId: ' category-1 ',
      costCenterId: '',
      studentId: ' student-1 ',
    });

    expect(normalizeFinancialRecordPayload(values, true)).toEqual({
      description: 'Mensalidade',
      amount: 1250.9,
      dueDate: '2026-02-10',
      status: 'open',
      categoryId: 'category-1',
      costCenterId: undefined,
      studentId: 'student-1',
    });
  });
});
