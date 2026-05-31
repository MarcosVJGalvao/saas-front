import { describe, expect, it } from 'vitest';
import {
  createLegalGuardianInitialValues,
  toLegalGuardianCreatePayload,
} from '@features/client/students/normalizers/legalGuardianForm.normalizer';
import {
  createStudentInitialValues,
  toStudentCreatePayload,
} from '@features/client/students/normalizers/studentForm.normalizer';
import { legalGuardianCreateFormSchema } from '@features/client/students/schemas/legalGuardianCreateForm.schema';
import { studentCreateFormSchema } from '@features/client/students/schemas/studentCreateForm.schema';

describe('student basic form normalizer', () => {
  it('cria estados iniciais padrão', () => {
    expect(createStudentInitialValues()).toEqual({
      fullName: '',
      documentNumber: '',
      documentType: 'CPF',
      dateOfBirth: '',
      naturality: '',
      gender: 'prefer_not_to_say',
      registrationCode: '',
      status: 'active',
    });
    expect(createLegalGuardianInitialValues().relationshipType).toBe('legal_guardian');
  });

  it('normaliza aluno com documento limpo', () => {
    const values = studentCreateFormSchema.parse({
      fullName: ' Ana Lima ',
      documentNumber: '123.456.789-00',
      documentType: 'CPF',
      dateOfBirth: '2015-01-10',
      naturality: ' Salvador ',
      gender: 'female',
      registrationCode: ' A-10 ',
      status: 'active',
    });

    expect(toStudentCreatePayload(values)).toEqual({
      registrationCode: 'A-10',
      status: 'active',
      person: {
        fullName: 'Ana Lima',
        documentNumber: '12345678900',
        documentType: 'CPF',
        dateOfBirth: '2015-01-10',
        naturality: 'Salvador',
        gender: 'female',
      },
    });
  });

  it('normaliza responsável com vínculo', () => {
    const values = legalGuardianCreateFormSchema.parse({
      fullName: ' Maria Lima ',
      documentNumber: '123.456.789-00',
      documentType: 'CPF',
      relationshipType: 'mother',
    });

    expect(toLegalGuardianCreatePayload(values)).toEqual({
      relationshipType: 'mother',
      person: {
        fullName: 'Maria Lima',
        documentNumber: '12345678900',
        documentType: 'CPF',
      },
    });
  });
});
