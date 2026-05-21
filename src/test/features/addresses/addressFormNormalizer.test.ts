import { describe, expect, it } from 'vitest';
import { normalizeAddressPayload } from '@features/client/addresses/normalizers/addressForm.normalizer';

describe('addressFormNormalizer', () => {
  it('normaliza CEP e campos opcionais', () => {
    const payload = normalizeAddressPayload({
      personId: ' person-1 ',
      street: ' Rua A ',
      number: '',
      complement: ' Casa ',
      neighborhood: '',
      city: ' São Paulo ',
      state: ' SP ',
      zipCode: '01001-000',
      country: ' Brasil ',
    });

    expect(payload).toEqual({
      personId: 'person-1',
      street: 'Rua A',
      number: undefined,
      complement: 'Casa',
      neighborhood: undefined,
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01001000',
      country: 'Brasil',
    });
  });
});
