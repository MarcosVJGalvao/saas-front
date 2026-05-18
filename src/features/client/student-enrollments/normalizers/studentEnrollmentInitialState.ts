import type {
  CreateStudentEnrollmentRequest,
  StudentEnrollmentOnboardingUiExtras,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

export const initialStudentEnrollmentValue: CreateStudentEnrollmentRequest = {
  student: {
    registrationCode: '',
    person: {
      fullName: '',
      documentNumber: '',
      documentType: 'CPF',
      dateOfBirth: '',
      gender: undefined,
      maritalStatus: undefined,
      nationality: 'brazilian',
      monthlyIncome: '',
    },
    addresses: [
      {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Brasil',
      },
    ],
    contacts: [
      { type: 'email', value: '' },
      { type: 'phone', value: '' },
    ],
    medicalInfo: {
      bloodType: '',
      allergies: '',
      chronicDiseases: '',
      medications: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      notes: '',
    },
    legalGuardians: [
      {
        relationshipType: 'mother',
        isPrimary: true,
        person: {
          fullName: '',
          documentNumber: '',
          documentType: 'CPF',
          dateOfBirth: '',
          gender: undefined,
          maritalStatus: undefined,
          nationality: 'brazilian',
          monthlyIncome: '',
        },
        addresses: [
          {
            street: '',
            number: '',
            complement: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Brasil',
          },
        ],
        contacts: [
          { type: 'email', value: '' },
          { type: 'phone', value: '' },
        ],
      },
    ],
  },
  academic: {
    academicYearId: '',
    schoolClassId: '',
    enrollmentDate: '',
  },
  enrollmentCode: '',
  observations: '',
};

export const initialStudentEnrollmentUiExtras: StudentEnrollmentOnboardingUiExtras = {
  selectedStudentId: '',
  studentCep: '',
  guardianCep: '',
  guardianEmail: '',
  guardianPhone: '',
  studentEmail: '',
  studentPhone: '',
};
