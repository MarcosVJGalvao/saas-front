import { describe, expect, it } from 'vitest';
import {
  buildLegalGuardianBasicInitialValues,
  buildStudentBasicInitialValues,
  normalizeLegalGuardianBasicPayload,
  normalizeStudentBasicPayload,
} from '@features/client/students/normalizers/studentBasicFormNormalizer';
import {
  legalGuardianBasicFormSchema,
  studentBasicFormSchema,
} from '@features/client/students/schemas/studentBasicFormSchema';

describe('student basic form normalizer', () => {
  it('cria estados iniciais padrão', () => {
    expect(buildStudentBasicInitialValues().status).toBe('active');
    expect(buildLegalGuardianBasicInitialValues().relationshipType).toBe('legal_guardian');
  });

  it('normaliza aluno com documento limpo', () => {
    const values = studentBasicFormSchema.parse({
      fullName: ' Ana Lima ',
      documentNumber: '123.456.789-00',
      documentType: 'CPF',
      dateOfBirth: '2015-01-10',
      gender: 'female',
      registrationCode: ' A-10 ',
      status: 'active',
    });

    expect(normalizeStudentBasicPayload(values)).toEqual({
      registrationCode: 'A-10',
      status: 'active',
      person: {
        fullName: 'Ana Lima',
        documentNumber: '12345678900',
        documentType: 'CPF',
        dateOfBirth: '2015-01-10',
        gender: 'female',
      },
    });
  });

  it('normaliza responsável com vínculo', () => {
    const values = legalGuardianBasicFormSchema.parse({
      fullName: ' Maria Lima ',
      documentNumber: '123.456.789-00',
      documentType: 'CPF',
      relationshipType: 'mother',
    });

    expect(normalizeLegalGuardianBasicPayload(values)).toEqual({
      relationshipType: 'mother',
      person: {
        fullName: 'Maria Lima',
        documentNumber: '12345678900',
        documentType: 'CPF',
      },
    });
  });
});
