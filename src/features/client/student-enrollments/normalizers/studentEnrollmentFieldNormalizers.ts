import type {
  DocumentType,
  Gender,
  GuardianRelationshipType,
  MaritalStatus,
  Nationality,
} from '@features/client/student-enrollments/types/studentEnrollment.types';

export const toEnrollmentDocumentType = (value: string): DocumentType | undefined => {
  if (
    value === 'CPF' ||
    value === 'CNPJ' ||
    value === 'RG' ||
    value === 'PASSPORT' ||
    value === 'OTHER'
  ) {
    return value;
  }
  return undefined;
};

export const toEnrollmentGender = (value: string): Gender | undefined => {
  if (
    value === 'male' ||
    value === 'female' ||
    value === 'other' ||
    value === 'prefer_not_to_say'
  ) {
    return value;
  }
  return undefined;
};

export const toEnrollmentMaritalStatus = (value: string): MaritalStatus | undefined => {
  if (
    value === 'single' ||
    value === 'married' ||
    value === 'divorced' ||
    value === 'widowed' ||
    value === 'other'
  ) {
    return value;
  }
  return undefined;
};

export const toEnrollmentNationality = (value: string): Nationality | undefined => {
  if (value === 'brazilian' || value === 'foreign' || value === 'other') {
    return value;
  }
  return undefined;
};

export const toGuardianRelationshipType = (value: string): GuardianRelationshipType | undefined => {
  if (
    value === 'mother' ||
    value === 'father' ||
    value === 'legal_guardian' ||
    value === 'grandparent' ||
    value === 'other'
  ) {
    return value;
  }
  return undefined;
};
