import { describe, expect, it } from 'vitest';
import {
  activeInactiveStatusOptions,
  paymentMethodOptions,
  reportCardAssessmentTypeOptions,
} from '@shared/constants/selectOptions';

describe('selectOptions', () => {
  it('expõe labels traduzidos reutilizáveis', () => {
    expect(activeInactiveStatusOptions).toEqual([
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' },
    ]);
    expect(paymentMethodOptions.find((option) => option.value === 'pix')?.label).toBe('Pix');
    expect(
      reportCardAssessmentTypeOptions.find((option) => option.value === 'regular')?.label,
    ).toBe('Regular');
  });
});
