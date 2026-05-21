import { describe, expect, it } from 'vitest';
import { normalizeContactPayload } from '@features/client/contacts/normalizers/contactForm.normalizer';

describe('contactFormNormalizer', () => {
  it('mantém e-mail textual e limpa telefone', () => {
    expect(
      normalizeContactPayload({
        personId: ' person-1 ',
        type: 'email',
        value: ' aluno@escola.com ',
        label: '',
        isPrimary: 'true',
      }),
    ).toEqual({
      personId: 'person-1',
      type: 'email',
      value: 'aluno@escola.com',
      label: undefined,
      isPrimary: true,
    });

    expect(
      normalizeContactPayload({
        personId: '',
        type: 'whatsapp',
        value: '(11) 99999-9999',
        label: ' Principal ',
        isPrimary: '',
      }),
    ).toEqual({
      personId: undefined,
      type: 'whatsapp',
      value: '11999999999',
      label: 'Principal',
      isPrimary: false,
    });
  });
});
