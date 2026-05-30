import { describe, expect, it, vi } from 'vitest';
import { toStudentDetailsData } from '@features/client/students/normalizers/studentDetails.normalizer';
import type { Student } from '@features/client/students/types/student.types';

const hasStringValue = (
  item: { label: string; value?: unknown },
  label: string,
  expectedValue: string,
): boolean => item.label === label && item.value === expectedValue;

const includesStringValue = (
  item: { label: string; value?: unknown },
  expectedSubstring: string,
): boolean => typeof item.value === 'string' && item.value.includes(expectedSubstring);

describe('studentDetails.normalizer', () => {
  it('usa os dados do payload de detalhes real do aluno', () => {
    const student: Student = {
      id: 'student-1',
      registrationCode: 'STU-2026-000001',
      status: 'active',
      schoolClass: null,
      medicalInfo: {
        id: 'medical-1',
        bloodType: 'O+',
        allergies: 'Dipirona',
        medications: undefined,
      },
      person: {
        id: 'person-1',
        fullName: 'Otávio Isaac Corte Real',
        documentNumber: '35919029501',
        documentType: 'CPF',
        dateOfBirth: '2023-04-11',
        nationality: 'brazilian',
        gender: 'male',
        maritalStatus: null,
        monthlyIncome: null,
        contacts: [],
        addresses: [
          {
            id: 'address-1',
            street: 'Rua Martacênia',
            number: '798',
            neighborhood: 'Águas Claras',
            city: 'Salvador',
            state: 'BA',
            zipCode: '41310160',
            country: 'Brasil',
          },
        ],
      },
      legalGuardians: [
        {
          id: 'guardian-link-1',
          relationshipType: 'mother',
          isPrimary: true,
          isFinancialResponsible: true,
          canPickUp: true,
          legalGuardian: {
            id: 'guardian-1',
            person: {
              id: 'guardian-person-1',
              fullName: 'Alana Andrea',
              documentNumber: '90634347071',
              documentType: 'CPF',
              dateOfBirth: '1999-12-31',
              nationality: 'brazilian',
              gender: 'female',
              maritalStatus: 'single',
              monthlyIncome: '10000.00',
              contacts: [
                {
                  id: 'guardian-contact-1',
                  type: 'email',
                  value: 'alana@example.com',
                },
              ],
              addresses: [
                {
                  id: 'guardian-address-1',
                  street: 'Rua Martacênia',
                  number: '798',
                  neighborhood: 'Águas Claras',
                  city: 'Salvador',
                  state: 'BA',
                  zipCode: '41310160',
                  country: 'Brasil',
                },
              ],
            },
          },
        },
      ],
      enrollments: [
        {
          id: 'enrollment-1',
          enrollmentCode: 'ENR-2026-000001',
          enrollmentDate: '2026-05-27',
          status: 'active',
          schoolClass: {
            id: 'class-1',
            name: 'Turma A',
            code: 'TA-Grupo1',
          },
          academicYear: {
            id: 'year-1',
            name: '2026',
          },
          financialSummary: {
            total: 0,
            received: 0,
            open: 0,
            overdue: 0,
          },
        },
      ],
      createdAt: '2026-05-29T02:32:57.090Z',
      updatedAt: '2026-05-29T02:32:57.090Z',
    };

    const detailsData = toStudentDetailsData(student, false, vi.fn(), vi.fn());
    const summaryItems = detailsData.tabs[0]?.sections[0]?.items ?? [];
    const addressItems = detailsData.tabs[2]?.sections[0]?.items ?? [];
    const medicalItems = detailsData.tabs[3]?.sections[0]?.items ?? [];
    const guardianItems = detailsData.tabs[4]?.sections[0]?.items ?? [];

    expect(detailsData.headerData?.title).toBe('Otávio Isaac Corte Real');
    expect(summaryItems.some((item) => hasStringValue(item, 'Nacionalidade', 'Brasileira'))).toBe(
      true,
    );
    expect(summaryItems.some((item) => hasStringValue(item, 'Gênero', 'Masculino'))).toBe(true);
    expect(addressItems.some((item) => includesStringValue(item, 'Rua Martacênia'))).toBe(true);
    expect(medicalItems.some((item) => hasStringValue(item, 'Tipo sanguíneo', 'O+'))).toBe(true);
    expect(medicalItems.some((item) => hasStringValue(item, 'Alergias', 'Dipirona'))).toBe(true);
    expect(guardianItems.some((item) => hasStringValue(item, 'Pode buscar', 'Sim'))).toBe(true);
  });
});
