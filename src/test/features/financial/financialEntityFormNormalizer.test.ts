import { describe, expect, it } from 'vitest';
import {
  buildFinancialEntityInitialValues,
  normalizeFinancialEntityPayload,
} from '@features/client/financial/normalizers/financialEntityFormNormalizer';
import { financialEntityFormSchema } from '@features/client/financial/schemas/financialEntityFormSchema';

describe('financial entity form normalizer', () => {
  it('cria estado inicial padrão', () => {
    expect(buildFinancialEntityInitialValues()).toEqual({
      name: '',
      code: '',
      type: 'expense',
      status: 'active',
      description: '',
    });
  });

  it('normaliza categoria com tipo', () => {
    const values = financialEntityFormSchema.parse({
      name: ' Mensalidade ',
      code: ' MEN ',
      type: 'revenue',
      status: 'active',
      description: '',
    });

    expect(normalizeFinancialEntityPayload(values, true)).toEqual({
      name: 'Mensalidade',
      code: 'MEN',
      type: 'revenue',
      status: 'active',
      description: undefined,
    });
  });

  it('normaliza centro de custo sem tipo', () => {
    const values = financialEntityFormSchema.parse({
      name: ' Administrativo ',
      code: '',
      type: 'expense',
      status: 'active',
      description: ' Operação ',
    });

    expect(normalizeFinancialEntityPayload(values, false)).toEqual({
      name: 'Administrativo',
      code: undefined,
      type: undefined,
      status: 'active',
      description: 'Operação',
    });
  });
});
