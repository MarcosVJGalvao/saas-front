import { describe, expect, it } from 'vitest';
import {
  toStudentEnrollmentCreatePayload,
  toStudentEnrollmentEditPayload,
} from '@features/client/student-enrollments/normalizers/studentEnrollmentForm.normalizer';
import type { CreateStudentEnrollmentRequest } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { StudentEnrollmentOnboardingUiExtras } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';

const baseUiExtras: StudentEnrollmentOnboardingUiExtras = {
  selectedStudentId: '',
  studentCep: '01310-100',
  studentEmail: 'aluno@escola.com',
  studentPhone: '(11) 98888-7777',
  studentPhoneIsWhatsApp: false,
  guardianCeps: ['01001-000'],
  guardianEmails: ['responsavel@escola.com'],
  guardianPhones: ['(11) 99999-9999'],
  guardianPhoneIsWhatsApp: [false],
};

const baseValue: CreateStudentEnrollmentRequest = {
  student: {
    registrationCode: 'ALU-001',
    person: {
      fullName: 'Maria da Silva',
      documentNumber: '123.456.789-00',
      documentType: 'CPF',
      dateOfBirth: '10/02/2015',
      naturality: ' São Paulo ',
      gender: 'female',
      maritalStatus: undefined,
      nationality: 'brazilian',
      monthlyIncome: '',
    },
    addresses: [
      {
        street: 'Avenida Paulista',
        number: '1000',
        complement: '',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '',
        country: 'Brasil',
      },
    ],
    contacts: [],
    medicalInfo: {
      allergies: 'Amendoim',
      emergencyContactPhone: '(11) 97777-6666',
    },
    legalGuardians: [
      {
        relationshipType: 'mother',
        isPrimary: true,
        person: {
          fullName: 'Ana da Silva',
          documentNumber: '987.654.321-00',
          documentType: 'CPF',
          naturality: ' Santos ',
          nationality: 'brazilian',
        },
        addresses: [
          {
            street: 'Praça da Sé',
            number: '1',
            complement: '',
            neighborhood: 'Sé',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '',
            country: 'Brasil',
          },
        ],
        contacts: [],
      },
    ],
  },
  academic: {
    academicYearId: 'year-1',
    schoolClassId: '',
    enrollmentDate: '17/05/2026',
  },
  enrollmentCode: '',
  observations: 'Aluno transferido.',
};

describe('toStudentEnrollmentCreatePayload', () => {
  it('normaliza aluno novo com documentos, telefones, CEP e datas limpos', () => {
    const payload = toStudentEnrollmentCreatePayload(baseValue, baseUiExtras);

    expect(payload.studentId).toBeUndefined();
    expect(payload.student?.person.documentNumber).toBe('12345678900');
    expect(payload.student?.person.dateOfBirth).toBe('2015-02-10');
    expect(payload.student?.person.naturality).toBe('São Paulo');
    expect(payload.student?.addresses[0]?.zipCode).toBe('01310100');
    expect(payload.student?.contacts).toEqual([
      { type: 'email', value: 'aluno@escola.com' },
      { type: 'phone', value: '11988887777' },
    ]);
    expect(payload.student?.legalGuardians[0]?.person?.documentNumber).toBe('98765432100');
    expect(payload.student?.legalGuardians[0]?.person?.naturality).toBe('Santos');
    expect(payload.student?.legalGuardians[0]?.contacts).toEqual([
      { type: 'email', value: 'responsavel@escola.com' },
      { type: 'phone', value: '11999999999' },
    ]);
    expect(payload.academic.enrollmentDate).toBe('2026-05-17');
  });

  it('prioriza studentId quando aluno existente é selecionado', () => {
    const payload = toStudentEnrollmentCreatePayload(baseValue, {
      ...baseUiExtras,
      selectedStudentId: 'student-123',
    });

    expect(payload.studentId).toBe('student-123');
    expect(payload.student).toBeUndefined();
  });
});

describe('toStudentEnrollmentEditPayload', () => {
  it('normaliza atualização com data ISO e campos opcionais limpos', () => {
    const payload = toStudentEnrollmentEditPayload({
      academicYearId: 'year-2',
      schoolClassId: '',
      enrollmentDate: '18/05/2026',
      enrollmentCode: ' MAT-2026-01 ',
      observations: '',
    });

    expect(payload).toEqual({
      academic: {
        academicYearId: 'year-2',
        schoolClassId: undefined,
        enrollmentDate: '2026-05-18',
      },
      enrollmentCode: 'MAT-2026-01',
      observations: undefined,
    });
  });
});
