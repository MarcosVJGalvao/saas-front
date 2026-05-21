import { describe, expect, it } from 'vitest';
import { normalizePersonPayload } from '@features/client/people/normalizers/personForm.normalizer';

describe('personFormNormalizer', () => {
  it('normaliza documento e campos textuais', () => {
    const payload = normalizePersonPayload({
      fullName: ' Maria Silva ',
      documentType: 'CPF',
      documentNumber: '123.456.789-00',
      dateOfBirth: '',
      gender: 'female',
      maritalStatus: 'single',
      nationality: 'brazilian',
    });

    expect(payload).toEqual({
      fullName: 'Maria Silva',
      documentType: 'CPF',
      documentNumber: '12345678900',
      dateOfBirth: undefined,
      gender: 'female',
      maritalStatus: 'single',
      nationality: 'brazilian',
    });
  });
});
