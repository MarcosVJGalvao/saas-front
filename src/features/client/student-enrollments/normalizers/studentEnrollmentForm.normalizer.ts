import type {
  CreateStudentEnrollmentRequest,
  EnrollmentAddress,
  EnrollmentContact,
  EnrollmentLegalGuardianInput,
  EnrollmentMedicalInfo,
  EnrollmentPerson,
  EnrollmentStudentInput,
  StudentEnrollment,
} from '@features/client/student-enrollments/types/studentEnrollment.types';
import type { StudentEnrollmentEditFormValues } from '@features/client/student-enrollments/schemas/studentEnrollmentEditForm.schema';
import type { StudentEnrollmentOnboardingUiExtras } from '@features/client/student-enrollments/types/studentEnrollmentOnboarding.types';
import { normalizeOptionalDateToIsoDate } from '@shared/normalizers/dateNormalizers';
import { onlyDigits } from '@shared/parsers/stringParsers';

const getOptionalText = (value?: string): string | undefined => {
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
  monthlyIncome: getOptionalText(person.monthlyIncome),
});

const normalizeAddress = (address: EnrollmentAddress, zipCode: string): EnrollmentAddress => ({
  street: address.street.trim(),
  number: address.number.trim(),
  complement: getOptionalText(address.complement),
  neighborhood: address.neighborhood.trim(),
  city: address.city.trim(),
  state: address.state.trim(),
  zipCode: onlyDigits(zipCode || address.zipCode),
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
  if (!medicalInfo) {
    return undefined;
  }

  const normalizedMedicalInfo: EnrollmentMedicalInfo = {
    bloodType: getOptionalText(medicalInfo.bloodType),
    allergies: getOptionalText(medicalInfo.allergies),
    chronicDiseases: getOptionalText(medicalInfo.chronicDiseases),
    medications: getOptionalText(medicalInfo.medications),
    emergencyContactName: getOptionalText(medicalInfo.emergencyContactName),
    emergencyContactPhone: getOptionalText(onlyDigits(medicalInfo.emergencyContactPhone ?? '')),
    notes: getOptionalText(medicalInfo.notes),
  };

  const hasAnyValue = Object.values(normalizedMedicalInfo).some(
    (currentValue) => currentValue !== undefined,
  );

  return hasAnyValue ? normalizedMedicalInfo : undefined;
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

  const primaryAddress = guardian.addresses?.[0];
  const primaryPerson = guardian.person;

  return {
    relationshipType: guardian.relationshipType,
    isPrimary: guardian.isPrimary,
    person: primaryPerson ? normalizePerson(primaryPerson) : undefined,
    addresses: primaryAddress ? [normalizeAddress(primaryAddress, uiExtras.guardianCep)] : [],
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
  const primaryAddress = student.addresses[0];

  return {
    registrationCode: getOptionalText(student.registrationCode),
    person: normalizePerson(student.person),
    addresses: primaryAddress ? [normalizeAddress(primaryAddress, uiExtras.studentCep)] : [],
    contacts: normalizeContacts(student.contacts, uiExtras.studentEmail, uiExtras.studentPhone),
    medicalInfo: normalizeMedicalInfo(student.medicalInfo),
    legalGuardians: student.legalGuardians.map((guardian) => normalizeGuardian(guardian, uiExtras)),
  };
};

export const toStudentEnrollmentCreatePayload = (
  formValues: CreateStudentEnrollmentRequest,
  uiExtras: StudentEnrollmentOnboardingUiExtras,
): CreateStudentEnrollmentRequest => {
  const selectedStudentId = getOptionalText(uiExtras.selectedStudentId || formValues.studentId);
  const enrollmentCode = getOptionalText(formValues.enrollmentCode);
  const observations = getOptionalText(formValues.observations);
  const schoolClassId = getOptionalText(formValues.academic.schoolClassId);
  const basePayload: CreateStudentEnrollmentRequest = {
    academic: {
      academicYearId: formValues.academic.academicYearId,
      schoolClassId,
      enrollmentDate: normalizeOptionalDateToIsoDate(formValues.academic.enrollmentDate) ?? '',
    },
    enrollmentCode,
    observations,
  };

  if (selectedStudentId) {
    return {
      ...basePayload,
      studentId: selectedStudentId,
    };
  }

  return {
    ...basePayload,
    student: formValues.student ? normalizeStudent(formValues.student, uiExtras) : undefined,
  };
};

export const toStudentEnrollmentEditFormValues = (
  enrollment: StudentEnrollment,
): StudentEnrollmentEditFormValues => ({
  academicYearId: enrollment.academicYear?.id ?? '',
  schoolClassId: enrollment.schoolClass?.id ?? '',
  enrollmentDate: enrollment.enrollmentDate,
  enrollmentCode: enrollment.enrollmentCode ?? '',
  observations: enrollment.observations ?? '',
});

export const toStudentEnrollmentEditPayload = (
  formValues: StudentEnrollmentEditFormValues,
): Partial<CreateStudentEnrollmentRequest> => ({
  academic: {
    academicYearId: formValues.academicYearId,
    schoolClassId: getOptionalText(formValues.schoolClassId),
    enrollmentDate:
      normalizeOptionalDateToIsoDate(formValues.enrollmentDate) ?? formValues.enrollmentDate,
  },
  enrollmentCode: getOptionalText(formValues.enrollmentCode),
  observations: getOptionalText(formValues.observations),
});
