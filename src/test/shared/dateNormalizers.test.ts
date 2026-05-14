import { describe, expect, it } from 'vitest';

import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';

describe('dateNormalizers', () => {
  it('normaliza data brasileira para ISO', () => {
    expect(normalizeOptionalDateToIsoDate('25/09/1900')).toBe('1900-09-25');
  });

  it('mantém data ISO válida', () => {
    expect(normalizeOptionalDateToIsoDate('1900-09-25')).toBe('1900-09-25');
  });

  it('remove valores vazios opcionais', () => {
    expect(normalizeOptionalDateToIsoDate('   ')).toBeUndefined();
    expect(normalizeOptionalDateToIsoDate()).toBeUndefined();
  });
});
