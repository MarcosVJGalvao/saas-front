import type { CreateStudentEnrollmentRequest } from '@features/client/student-enrollments/types/studentEnrollment.types';
import type {
  StudentEnrollmentOnboardingUiExtras,
  StudentEnrollmentStateFactories,
} from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';
import type {
  EnrollmentAddress,
  EnrollmentContact,
  EnrollmentLegalGuardianInput,
  EnrollmentMedicalInfo,
  EnrollmentPerson,
  EnrollmentStudentInput,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

const createEmptyPerson = (): EnrollmentPerson => ({
  fullName: '',
  documentNumber: '',
  documentType: 'CPF',
  dateOfBirth: '',
  naturality: '',
  gender: undefined,
  maritalStatus: undefined,
  nationality: 'brazilian',
  monthlyIncome: '',
});

const createEmptyAddress = (): EnrollmentAddress => ({
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'Brasil',
});

const createEmptyContactList = (): EnrollmentContact[] => [
  { type: 'email', value: '' },
  { type: 'phone', value: '' },
];

const createEmptyMedicalInfo = (): EnrollmentMedicalInfo => ({
  bloodType: '',
  allergies: '',
  chronicDiseases: '',
  medications: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  notes: '',
});

const createEmptyGuardian = (): EnrollmentLegalGuardianInput => ({
  relationshipType: 'mother',
  isPrimary: true,
  canPickUp: true,
  person: createEmptyPerson(),
  addresses: [createEmptyAddress()],
  contacts: [],
});

const ensureStudent = (currentValue: CreateStudentEnrollmentRequest): EnrollmentStudentInput => ({
  registrationCode: currentValue.student?.registrationCode ?? '',
  person: currentValue.student?.person ?? createEmptyPerson(),
  addresses: currentValue.student?.addresses ?? [createEmptyAddress()],
  contacts: currentValue.student?.contacts ?? createEmptyContactList(),
  medicalInfo: currentValue.student?.medicalInfo ?? createEmptyMedicalInfo(),
  legalGuardians: currentValue.student?.legalGuardians ?? [createEmptyGuardian()],
});

export const studentEnrollmentStateFactories: StudentEnrollmentStateFactories = {
  createEmptyAddress,
  createEmptyContactList,
  createEmptyGuardian,
  createEmptyMedicalInfo,
  createEmptyPerson,
  ensureStudent,
};

export const initialStudentEnrollmentValue: CreateStudentEnrollmentRequest = {
  student: {
    registrationCode: '',
    person: createEmptyPerson(),
    addresses: [createEmptyAddress()],
    contacts: createEmptyContactList(),
    medicalInfo: createEmptyMedicalInfo(),
    legalGuardians: [createEmptyGuardian()],
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
  studentEmail: '',
  studentPhone: '',
  studentPhoneIsWhatsApp: false,
  guardianCeps: [''],
  guardianEmails: [''],
  guardianPhones: [''],
  guardianPhoneIsWhatsApp: [false],
};
