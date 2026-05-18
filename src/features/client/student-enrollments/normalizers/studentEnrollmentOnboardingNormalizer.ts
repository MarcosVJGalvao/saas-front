import type {
  CreateStudentEnrollmentRequest,
  EnrollmentAddress,
  EnrollmentContact,
  EnrollmentLegalGuardianInput,
  EnrollmentMedicalInfo,
  EnrollmentPerson,
  EnrollmentStudentInput,
  StudentEnrollmentOnboardingUiExtras,
} from '@features/client/student-enrollments/types/studentEnrollment.types';
import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';
import { onlyDigits } from '@shared/parsers/stringParsers';

const optionalText = (value?: string): string | undefined => {
  const trimmedValue = value?.trim() ?? '';
  return trimmedValue.length > 0 ? trimmedValue : undefined;
};

const normalizePerson = (person: EnrollmentPerson): EnrollmentPerson => ({
  fullName: person.fullName.trim(),
  documentNumber: onlyDigits(person.documentNumber),
  documentType: person.documentType,
  dateOfBirth: normalizeOptionalDateToIsoDate(person.dateOfBirth),
  gender: person.gender,
  maritalStatus: person.maritalStatus,
  nationality: person.nationality,
  monthlyIncome: optionalText(person.monthlyIncome),
});

const normalizeAddress = (address: EnrollmentAddress, cep: string): EnrollmentAddress => ({
  street: address.street.trim(),
  number: address.number.trim(),
  complement: optionalText(address.complement),
  neighborhood: address.neighborhood.trim(),
  city: address.city.trim(),
  state: address.state.trim(),
  zipCode: onlyDigits(cep || address.zipCode),
  country: address.country.trim() || 'Brasil',
});

const normalizeContacts = (
  contacts: EnrollmentContact[],
  email: string,
  phone: string,
): EnrollmentContact[] => {
  const normalizedContacts: EnrollmentContact[] = [
    { type: 'email', value: email.trim() },
    { type: 'phone', value: onlyDigits(phone) },
    ...contacts.filter((contact) => contact.type !== 'email' && contact.type !== 'phone'),
  ];

  return normalizedContacts.filter((contact) => contact.value.length > 0);
};

const normalizeMedicalInfo = (
  medicalInfo?: EnrollmentMedicalInfo,
): EnrollmentMedicalInfo | undefined => {
  if (!medicalInfo) return undefined;

  const normalized: EnrollmentMedicalInfo = {
    bloodType: optionalText(medicalInfo.bloodType),
    allergies: optionalText(medicalInfo.allergies),
    chronicDiseases: optionalText(medicalInfo.chronicDiseases),
    medications: optionalText(medicalInfo.medications),
    emergencyContactName: optionalText(medicalInfo.emergencyContactName),
    emergencyContactPhone: optionalText(onlyDigits(medicalInfo.emergencyContactPhone ?? '')),
    notes: optionalText(medicalInfo.notes),
  };

  const hasValue = Object.values(normalized).some((value) => value !== undefined);
  return hasValue ? normalized : undefined;
};

const normalizeGuardian = (
  guardian: EnrollmentLegalGuardianInput,
  uiExtras: StudentEnrollmentOnboardingUiExtras,
): EnrollmentLegalGuardianInput => {
  if (guardian.legalGuardianId && guardian.legalGuardianId.length > 0) {
    return {
      legalGuardianId: guardian.legalGuardianId,
      relationshipType: guardian.relationshipType,
      isPrimary: guardian.isPrimary,
    };
  }

  const address = guardian.addresses?.[0];
  const person = guardian.person;

  return {
    relationshipType: guardian.relationshipType,
    isPrimary: guardian.isPrimary,
    person: person ? normalizePerson(person) : undefined,
    addresses: address ? [normalizeAddress(address, uiExtras.guardianCep)] : [],
    contacts: normalizeContacts(
      guardian.contacts ?? [],
      uiExtras.guardianEmail,
      uiExtras.guardianPhone,
    ),
  };
};

const normalizeStudent = (
  student: EnrollmentStudentInput,
  uiExtras: StudentEnrollmentOnboardingUiExtras,
): EnrollmentStudentInput => {
  const address = student.addresses[0];
  return {
    registrationCode: optionalText(student.registrationCode),
    person: normalizePerson(student.person),
    addresses: address ? [normalizeAddress(address, uiExtras.studentCep)] : [],
    contacts: normalizeContacts(student.contacts, uiExtras.studentEmail, uiExtras.studentPhone),
    medicalInfo: normalizeMedicalInfo(student.medicalInfo),
    legalGuardians: student.legalGuardians.map((guardian) => normalizeGuardian(guardian, uiExtras)),
  };
};

export const toStudentEnrollmentPayload = (
  value: CreateStudentEnrollmentRequest,
  uiExtras: StudentEnrollmentOnboardingUiExtras,
): CreateStudentEnrollmentRequest => {
  const studentId = optionalText(uiExtras.selectedStudentId || value.studentId);
  const enrollmentCode = optionalText(value.enrollmentCode);
  const observations = optionalText(value.observations);
  const schoolClassId = optionalText(value.academic.schoolClassId);
  const basePayload = {
    academic: {
      academicYearId: value.academic.academicYearId,
      schoolClassId,
      enrollmentDate: normalizeOptionalDateToIsoDate(value.academic.enrollmentDate) ?? '',
    },
    enrollmentCode,
    observations,
  };

  if (studentId) {
    return {
      ...basePayload,
      studentId,
    };
  }

  return {
    ...basePayload,
    student: value.student ? normalizeStudent(value.student, uiExtras) : undefined,
  };
};
